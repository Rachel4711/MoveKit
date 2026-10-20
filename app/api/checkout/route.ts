import { z } from "zod";
import { createPendingOrder, attachStripeSession, markOrderCheckoutFailed } from "@/db/orders";
import { getProducts } from "@/db/products";
import { createStripeCheckoutSession, isStripeConfigured } from "@/lib/stripe";

const checkoutSchema = z.object({
  items: z.array(z.object({
    slug: z.string().min(1),
    variant: z.string().min(1),
    quantity: z.number().int().min(1).max(20),
  })).min(1).max(20),
});

export async function POST(request: Request) {
  if (!isStripeConfigured()) {
    return Response.json(
      { error: "Stripe test checkout is not configured yet." },
      { status: 503 },
    );
  }

  const parsed = checkoutSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Invalid cart." }, { status: 400 });

  let orderId: string | undefined;
  try {
    const productMap = new Map((await getProducts()).map((product) => [product.slug, product]));
    const lines = parsed.data.items.map((item) => {
      const product = productMap.get(item.slug);
      if (!product) throw new Error(`Product not found: ${item.slug}`);
      if (!product.variants.includes(item.variant)) throw new Error(`Invalid option for ${product.name}.`);
      if (item.quantity > product.inventory) throw new Error(`Only ${product.inventory} ${product.name} available.`);
      return {
        productSlug: product.slug,
        productName: product.name,
        variant: item.variant,
        unitPriceInCents: product.price * 100,
        quantity: item.quantity,
      };
    });
    const order = await createPendingOrder(lines);
    orderId = order.orderId;
    const session = await createStripeCheckoutSession(orderId, lines, new URL(request.url).origin);
    await attachStripeSession(orderId, session.id);
    return Response.json({ url: session.url });
  } catch (error) {
    if (orderId) await markOrderCheckoutFailed(orderId);
    const message = error instanceof Error ? error.message : "Unable to start checkout.";
    return Response.json({ error: message }, { status: 400 });
  }
}
