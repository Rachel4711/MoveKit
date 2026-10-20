"use client";

import Image from "next/image";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { CheckoutButton } from "@/components/checkout-button";

export function CartDrawer() {
  const { items, total, isOpen, updateQuantity, removeItem, clearCart, setOpen } = useCart();
  const freeShippingTarget = 75;
  const shippingRemaining = Math.max(0, freeShippingTarget - total);
  const shippingProgress = Math.min(100, (total / freeShippingTarget) * 100);
  return <div className={isOpen ? "cart-layer is-open" : "cart-layer"} aria-hidden={!isOpen}>
    <button className="cart-backdrop" aria-label="Close cart" onClick={() => setOpen(false)} />
    <aside className="cart-drawer" aria-label="Shopping cart">
      <div className="cart-heading"><div><span className="eyebrow">Your gear</span><h2>Shopping bag</h2></div><button className="icon-button" onClick={() => setOpen(false)} aria-label="Close cart"><X /></button></div>
      {items.length === 0 ? <div className="empty-cart"><ShoppingBag size={34} /><h3>Your bag is ready for action.</h3><p>Add portable gear and start building your kit.</p></div> : <>
        <div className="shipping-meter"><p>{shippingRemaining > 0 ? <>Add <strong>${shippingRemaining.toFixed(2)}</strong> for free shipping.</> : <strong>You unlocked free shipping.</strong>}</p><div><span style={{ width: `${shippingProgress}%` }} /></div></div>
        <div className="cart-items">{items.map((item) => <article className="cart-item" key={item.id}><Image src={item.image} alt="" width={76} height={76} /><div className="cart-item-copy"><strong>{item.name}</strong><p>{item.variant} · ${item.price}</p><div className="quantity-control"><button onClick={() => updateQuantity(item.id, item.quantity - 1)} aria-label={`Decrease ${item.name} quantity`}><Minus /></button><span>{item.quantity}</span><button onClick={() => updateQuantity(item.id, item.quantity + 1)} aria-label={`Increase ${item.name} quantity`}><Plus /></button></div></div><button className="icon-button" onClick={() => removeItem(item.id)} aria-label={`Remove ${item.name}`}><Trash2 size={18} /></button></article>)}</div>
        <button className="clear-cart" onClick={clearCart}>Clear bag</button>
      </>}
      <div className="cart-total"><span>Total</span><strong>${total.toFixed(2)}</strong></div>
      <CheckoutButton items={items} />
    </aside>
  </div>;
}
