"use client";

import { ShoppingBag, Trash2, X } from "lucide-react";
import { useCart } from "@/components/cart-provider";

export function CartDrawer() {
  const { items, total, isOpen, removeItem, setOpen } = useCart();
  return <div className={isOpen ? "cart-layer is-open" : "cart-layer"} aria-hidden={!isOpen}>
    <button className="cart-backdrop" aria-label="Close cart" onClick={() => setOpen(false)} />
    <aside className="cart-drawer" aria-label="Shopping cart">
      <div className="cart-heading"><div><span className="eyebrow">Your gear</span><h2>Shopping bag</h2></div><button className="icon-button" onClick={() => setOpen(false)} aria-label="Close cart"><X /></button></div>
      {items.length === 0 ? <div className="empty-cart"><ShoppingBag size={34} /><h3>Your bag is ready for action.</h3><p>Add portable gear and start building your kit.</p></div> :
        <div className="cart-items">{items.map((item) => <div className="cart-item" key={item.slug}><div><strong>{item.name}</strong><p>Qty {item.quantity} · ${item.price}</p></div><button className="icon-button" onClick={() => removeItem(item.slug)} aria-label={`Remove ${item.name}`}><Trash2 size={18} /></button></div>)}</div>}
      <div className="cart-total"><span>Total</span><strong>${total.toFixed(2)}</strong></div>
      <button className="button button-primary button-full" disabled={!items.length}>Checkout — coming next</button>
    </aside>
  </div>;
}
