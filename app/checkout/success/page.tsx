import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { OrderComplete } from "@/components/order-complete";
import { requireChatGPTUser } from "@/app/chatgpt-auth";
import { getOrderForCheckoutSession } from "@/db/orders";
import { retrieveStripeCheckoutSession } from "@/lib/stripe";

export const dynamic = "force-dynamic";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id: sessionId } = await searchParams;
  const user = await requireChatGPTUser(sessionId ? `/checkout/success?session_id=${encodeURIComponent(sessionId)}` : "/checkout/success");
  let paymentConfirmed = false;
  let paymentProcessing = false;

  if (sessionId?.startsWith("cs_")) {
    const [session, order] = await Promise.all([
      retrieveStripeCheckoutSession(sessionId).catch(() => null),
      getOrderForCheckoutSession(sessionId, user.userId),
    ]);
    paymentConfirmed = Boolean(order && session?.client_reference_id === order.id && session.payment_status === "paid");
    paymentProcessing = Boolean(order && session?.client_reference_id === order.id && session.status === "complete");
  }

  const heading = paymentConfirmed
    ? "Your kit is on its way."
    : paymentProcessing ? "Your payment is processing." : "No verified checkout found.";
  const message = paymentConfirmed
    ? "Thanks for choosing MoveKit. Stripe confirmed your test payment securely."
    : paymentProcessing
      ? "Stripe is still confirming the payment. Your order history will update automatically."
      : "Start from your shopping bag when you are ready to test checkout.";

  return <main className="checkout-result">
    {paymentConfirmed && <OrderComplete />}
    <CheckCircle2 aria-hidden="true" />
    <span className="eyebrow">{paymentConfirmed ? "Payment received" : "Checkout status"}</span>
    <h1>{heading}</h1>
    <p>{message}</p>
    <div className="checkout-result-actions">
      <Link className="button button-primary" href="/account">View orders</Link>
      <Link className="button button-light" href="/">Keep exploring</Link>
    </div>
  </main>;
}
