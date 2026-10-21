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
      const shipping = session.shipping_details;
      await finalizePaidOrder(event.id, orderId, {
        customerEmail: session.customer_details?.email ?? undefined,
        customerName: shipping?.name ?? session.customer_details?.name ?? undefined,
        customerPhone: session.customer_details?.phone ?? undefined,
        shippingAddress: shipping?.address ?? session.customer_details?.address ?? undefined,
        paymentIntentId: session.payment_intent ?? undefined,
        discountInCents: session.total_details?.amount_discount ?? undefined,
        totalInCents: session.amount_total ?? undefined,
      });
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
