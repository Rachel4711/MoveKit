import Link from "next/link";
import { ArrowLeft, MapPin, PackageCheck, Truck } from "lucide-react";
import { notFound } from "next/navigation";
import { requireChatGPTUser } from "@/app/chatgpt-auth";
import { getOrderForUser } from "@/db/orders";

export const dynamic = "force-dynamic";

function money(cents: number, currency: string) { return new Intl.NumberFormat("en-US", { style: "currency", currency: currency.toUpperCase() }).format(cents / 100); }

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireChatGPTUser(`/account/orders/${id}`);
  const order = await getOrderForUser(id, user.userId);
  if (!order) notFound();
  const address = order.shippingAddressJson ? JSON.parse(order.shippingAddressJson) as Record<string, string | null> : null;
  return <main className="order-detail-page"><Link href="/account" className="back-link"><ArrowLeft /> Back to account</Link><header><div><span className="eyebrow">Order #{order.id.slice(0, 8).toUpperCase()}</span><h1>{order.status.replace("_", " ")}.</h1></div><span className={`order-status status-${order.status}`}>{order.status.replace("_", " ")}</span></header><div className="order-detail-grid"><section><h2><PackageCheck /> Items</h2>{order.items.map((item) => <article className="order-detail-item" key={item.id}><div><strong>{item.productName}</strong><span>{item.variant} · Quantity {item.quantity}</span></div><strong>{money(item.unitPriceInCents * item.quantity, order.currency)}</strong></article>)}<dl className="order-totals"><div><dt>Subtotal</dt><dd>{money(order.subtotalInCents, order.currency)}</dd></div>{order.discountInCents > 0 && <div><dt>Promotion</dt><dd>−{money(order.discountInCents, order.currency)}</dd></div>}<div><dt>Total</dt><dd>{money(order.totalInCents ?? order.subtotalInCents, order.currency)}</dd></div></dl></section><aside><section><h2><MapPin /> Delivery</h2>{address ? <address>{order.customerName}<br />{address.line1}{address.line2 ? <><br />{address.line2}</> : null}<br />{address.postal_code} {address.city}, {address.state}<br />{address.country}<br />{order.customerPhone}</address> : <p>Address will appear after Stripe confirms checkout.</p>}</section><section><h2><Truck /> Tracking</h2>{order.trackingNumber ? <p><strong>{order.carrier}</strong><br />{order.trackingNumber}</p> : <p>Tracking will appear after your order ships.</p>}</section></aside></div></main>;
}
