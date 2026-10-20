import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { orderItems, orders } from "@/db/schema";

export type OrderLine = {
  productSlug: string;
  productName: string;
  variant: string;
  unitPriceInCents: number;
  quantity: number;
};

export async function createPendingOrder(lines: OrderLine[]) {
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

export async function markOrderPaid(orderId: string, customerEmail?: string) {
  await getDb().update(orders).set({
    status: "paid",
    customerEmail: customerEmail ?? null,
    updatedAt: new Date().toISOString(),
  }).where(eq(orders.id, orderId));
}
