import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { OrderComplete } from "@/components/order-complete";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id: sessionId } = await searchParams;
  const hasCheckoutSession = sessionId?.startsWith("cs_") ?? false;

  return <main className="checkout-result">
    {hasCheckoutSession && <OrderComplete />}
    <CheckCircle2 aria-hidden="true" />
    <span className="eyebrow">{hasCheckoutSession ? "Payment received" : "Checkout status"}</span>
    <h1>{hasCheckoutSession ? "Your kit is on its way." : "No checkout found."}</h1>
    <p>{hasCheckoutSession
      ? "Thanks for choosing MoveKit. Stripe has securely processed your test payment."
      : "Start from your shopping bag when you are ready to test checkout."}</p>
    <Link className="button button-primary" href="/">Keep exploring</Link>
  </main>;
}
