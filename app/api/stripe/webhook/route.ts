import { finalizePaidOrder } from "@/db/orders";
import { verifyStripeWebhook } from "@/lib/stripe";

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  if (!signature) return new Response("Missing signature.", { status: 400 });

  try {
    const event = await verifyStripeWebhook(await request.text(), signature);
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const orderId = session.metadata?.order_id;
      if (orderId) await finalizePaidOrder(event.id, orderId, session.customer_details?.email ?? undefined);
    }
    return Response.json({ received: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid webhook.";
    return new Response(message, { status: 400 });
  }
}
