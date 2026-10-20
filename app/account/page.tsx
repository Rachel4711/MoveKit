import Link from "next/link";
import { LogOut, PackageOpen } from "lucide-react";
import { chatGPTSignOutPath, requireChatGPTUser } from "@/app/chatgpt-auth";
import { getOrdersForUser } from "@/db/orders";
import { isAdminEmail } from "@/lib/admin";

export const dynamic = "force-dynamic";

function formatMoney(cents: number, currency: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: currency.toUpperCase() })
    .format(cents / 100);
}

export default async function AccountPage() {
  const user = await requireChatGPTUser("/account");
  const orders = await getOrdersForUser(user.userId);
  const isAdmin = isAdminEmail(user.email);

  return <main className="account-page">
    <header className="account-heading">
      <div><span className="eyebrow">MoveKit member</span><h1>Hi, {user.displayName}.</h1><p>{user.email}</p></div>
      <div className="account-actions">{isAdmin && <Link className="account-signout" href="/admin">Manage store</Link>}<a className="account-signout" href={chatGPTSignOutPath("/")} target="_top"><LogOut size={17} /> Sign out</a></div>
    </header>
    <section aria-labelledby="orders-heading">
      <div className="section-heading account-section-heading"><div><span className="eyebrow">Order history</span><h2 id="orders-heading">Your gear</h2></div></div>
      {orders.length === 0 ? <div className="orders-empty"><PackageOpen /><h3>No orders yet.</h3><p>Your completed and pending orders will appear here.</p><Link className="button button-primary" href="/#shop">Shop MoveKit</Link></div> :
        <div className="order-list">{orders.map((order) => <article className="order-card" key={order.id}>
          <header><div><span>Order</span><strong>#{order.id.slice(0, 8).toUpperCase()}</strong></div><span className={`order-status status-${order.status}`}>{order.status.replace("_", " ")}</span></header>
          <div className="order-items">{order.items.map((item) => <div key={item.id}><div><strong>{item.productName}</strong><span>{item.variant} · Qty {item.quantity}</span></div><strong>{formatMoney(item.unitPriceInCents * item.quantity, order.currency)}</strong></div>)}</div>
          <footer><span>{new Date(order.createdAt).toLocaleDateString("en-MY", { dateStyle: "medium" })}</span><strong>{formatMoney(order.subtotalInCents, order.currency)}</strong></footer>
        </article>)}</div>}
    </section>
  </main>;
}
