import { finalizePaidOrder, markStripeOrderFailed } from "@/db/orders";
import { verifyStripeWebhook } from "@/lib/stripe";

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  if (!signature) return new Response("Missing signature.", { status: 400 });

  try {
    const event = await verifyStripeWebhook(await request.text(), signature);
    const session = event.data.object;
    const orderId = session.metadata?.order_id;
    const paymentSucceeded = event.type === "checkout.session.async_payment_succeeded"
      || (event.type === "checkout.session.completed" && session.payment_status === "paid");

    if (orderId && paymentSucceeded) {
      await finalizePaidOrder(event.id, orderId, session.customer_details?.email ?? undefined);
    } else if (orderId && event.type === "checkout.session.async_payment_failed") {
      await markStripeOrderFailed(orderId, "payment_failed");
    } else if (orderId && event.type === "checkout.session.expired") {
      await markStripeOrderFailed(orderId, "expired");
    }
    return Response.json({ received: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid webhook.";
    return new Response(message, { status: 400 });
  }
}
