import { and, desc, eq, gte, inArray, ne, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { orderItems, orders, paymentEvents, products } from "@/db/schema";

export type OrderLine = {
  productSlug: string;
  productName: string;
  variant: string;
  unitPriceInCents: number;
  quantity: number;
};

export async function createPendingOrder(lines: OrderLine[], user: { userId: string; email: string }) {
  const db = getDb();
  const orderId = crypto.randomUUID();
  const now = new Date().toISOString();
  const subtotalInCents = lines.reduce(
    (sum, line) => sum + line.unitPriceInCents * line.quantity,
    0,
  );

  await db.batch([
    db.insert(orders).values({
      id: orderId,
      userId: user.userId,
      customerEmail: user.email,
      status: "pending",
      currency: "usd",
      subtotalInCents,
      createdAt: now,
      updatedAt: now,
    }),
    ...lines.map((line) => db.insert(orderItems).values({
      id: crypto.randomUUID(),
      orderId,
      ...line,
    })),
  ]);

  return { orderId, subtotalInCents };
}

export async function attachStripeSession(orderId: string, stripeSessionId: string) {
  await getDb().update(orders).set({
    stripeSessionId,
    updatedAt: new Date().toISOString(),
  }).where(eq(orders.id, orderId));
}

export async function markOrderCheckoutFailed(orderId: string) {
  await getDb().update(orders).set({
    status: "checkout_failed",
    updatedAt: new Date().toISOString(),
  }).where(eq(orders.id, orderId));
}

export async function finalizePaidOrder(eventId: string, orderId: string, customerEmail?: string) {
  const db = getDb();
  const [order] = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
  if (!order || order.status === "paid") return;

  const lines = await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  const productRows = await db.select({ slug: products.slug, inventory: products.inventory })
    .from(products)
    .where(inArray(products.slug, lines.map((line) => line.productSlug)));
  const inventoryBySlug = new Map(productRows.map((product) => [product.slug, product.inventory]));
  for (const line of lines) {
    if ((inventoryBySlug.get(line.productSlug) ?? 0) < line.quantity) {
      throw new Error(`Insufficient inventory for ${line.productName}.`);
    }
  }

  // The event record and stock updates share one D1 batch. A repeated Stripe
  // event conflicts on its primary key and rolls the entire batch back.
  await db.batch([
    db.insert(paymentEvents).values({ id: eventId, processedAt: new Date().toISOString() }),
    ...lines.map((line) => db.update(products)
      .set({ inventory: sql`${products.inventory} - ${line.quantity}` })
      .where(and(eq(products.slug, line.productSlug), gte(products.inventory, line.quantity)))),
    db.update(orders).set({
      status: "paid",
      customerEmail: customerEmail ?? order.customerEmail,
      updatedAt: new Date().toISOString(),
    }).where(and(eq(orders.id, orderId), ne(orders.status, "paid"))),
  ]);
}

export async function getOrdersForUser(userId: string) {
  const db = getDb();
  const customerOrders = await db.select().from(orders)
    .where(eq(orders.userId, userId))
    .orderBy(desc(orders.createdAt))
    .limit(50);
  if (customerOrders.length === 0) return [];

  const items = await db.select().from(orderItems)
    .where(inArray(orderItems.orderId, customerOrders.map((order) => order.id)));
  return customerOrders.map((order) => ({
    ...order,
    items: items.filter((item) => item.orderId === order.id),
  }));
}
