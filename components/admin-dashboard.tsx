"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/products";

type AdminOrder = {
  id: string;
  status: string;
  customerEmail: string | null;
  subtotalInCents: number;
  currency: string;
  createdAt: string;
  customerName: string | null;
  customerPhone: string | null;
  shippingAddressJson: string | null;
  carrier: string | null;
  trackingNumber: string | null;
  discountInCents: number;
  totalInCents: number | null;
  items: Array<{ id: string; productName: string; variant: string; quantity: number }>;
};

const categories = ["Strength", "Mobility", "Cardio", "Recovery"];
const orderStatuses = ["processing", "shipped", "delivered", "cancelled", "refunded"];

function ProductFields({ product }: { product?: Product }) {
  return <div className="admin-fields">
    <label>Slug<input name="slug" defaultValue={product?.slug} readOnly={Boolean(product)} required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" /></label>
    <label>Name<input name="name" defaultValue={product?.name} required /></label>
    <label>Category<select name="category" defaultValue={product?.category ?? "Strength"}>{categories.map((category) => <option key={category}>{category}</option>)}</select></label>
    <label>Price (USD)<input name="price" type="number" min="0.01" step="0.01" defaultValue={product?.price} required /></label>
    <label>Inventory<input name="inventory" type="number" min="0" step="1" defaultValue={product?.inventory ?? 0} required /></label>
    <label>Accent<input name="accent" defaultValue={product?.accent ?? "lime"} required /></label>
    <label>Badge<input name="badge" defaultValue={product?.badge ?? ""} /></label>
    <label>Variants, comma separated<input name="variants" defaultValue={product?.variants.join(", ")} required /></label>
    <label className="admin-wide">Description<textarea name="description" defaultValue={product?.description} required /></label>
    <label className="admin-wide">Image URL<input name="imageUrl" defaultValue={product?.image.startsWith("http") ? product.image : ""} placeholder="https://…" /></label>
    <label className="admin-wide">Upload replacement image<input name="image" type="file" accept="image/jpeg,image/png,image/webp,image/avif" /></label>
    <label className="admin-check"><input name="featured" type="checkbox" value="true" defaultChecked={product?.featured} /> Featured product</label>
  </div>;
}

export function AdminDashboard({ products, orders }: { products: Product[]; orders: AdminOrder[] }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState("");

  async function submitProduct(form: HTMLFormElement, slug?: string) {
    setBusy(slug ?? "new"); setMessage("");
    const response = await fetch(slug ? `/api/admin/products/${slug}` : "/api/admin/products", {
      method: slug ? "PATCH" : "POST",
      body: new FormData(form),
    });
    const result = await response.json() as { error?: string };
    setBusy("");
    if (!response.ok) return setMessage(result.error ?? "Product update failed.");
    setMessage(slug ? "Product updated." : "Product created.");
    if (!slug) form.reset();
    router.refresh();
  }

  async function removeProduct(slug: string) {
    if (!window.confirm(`Delete ${slug}?`)) return;
    setBusy(slug); setMessage("");
    const response = await fetch(`/api/admin/products/${slug}`, { method: "DELETE" });
    setBusy("");
    if (!response.ok) return setMessage("Product deletion failed.");
    setMessage("Product deleted."); router.refresh();
  }

  async function saveFulfillment(form: HTMLFormElement, orderId: string) {
    const data = new FormData(form);
    const status = String(data.get("status") ?? "");
    if (!status) return;
    if (status === "refunded" && !window.confirm("Issue a Stripe refund for this order? This cannot be undone.")) return;
    setBusy(orderId); setMessage("");
    const response = await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status, carrier: data.get("carrier"), trackingNumber: data.get("trackingNumber") }),
    });
    setBusy("");
    const result = await response.json() as { error?: string };
    if (!response.ok) return setMessage(result.error ?? "Order update failed.");
    setMessage("Order status updated."); router.refresh();
  }

  return <div className="admin-dashboard">
    {message && <p className="admin-message" role="status">{message}</p>}
    <section><h2>Add product</h2><form onSubmit={(event) => { event.preventDefault(); void submitProduct(event.currentTarget); }}><ProductFields /><button className="button button-primary" disabled={busy === "new"}>{busy === "new" ? "Saving…" : "Create product"}</button></form></section>
    <section><h2>Manage products</h2><div className="admin-product-list">{products.map((product) => <details key={product.slug}><summary><strong>{product.name}</strong><span>{product.inventory} in stock · ${product.price}</span></summary><form onSubmit={(event) => { event.preventDefault(); void submitProduct(event.currentTarget, product.slug); }}><ProductFields product={product} /><div className="admin-actions"><button className="button button-primary" disabled={busy === product.slug}>Save changes</button><button type="button" className="button button-danger" onClick={() => void removeProduct(product.slug)}>Delete</button></div></form></details>)}</div></section>
    <section><h2>Manage orders</h2>{orders.length === 0 ? <p className="admin-muted">No orders yet.</p> : <div className="admin-order-list">{orders.map((order) => { const address = order.shippingAddressJson ? JSON.parse(order.shippingAddressJson) as Record<string, string | null> : null; return <article key={order.id}><div><strong>#{order.id.slice(0, 8).toUpperCase()}</strong><span>{order.customerName ?? order.customerEmail ?? "No customer details"}</span><small>{order.items.map((item) => `${item.productName} (${item.variant}) × ${item.quantity}`).join(", ")}</small>{address && <address>{address.line1}, {address.postal_code} {address.city}, {address.state}</address>}</div><form onSubmit={(event) => { event.preventDefault(); void saveFulfillment(event.currentTarget, order.id); }}><strong>${((order.totalInCents ?? order.subtotalInCents) / 100).toFixed(2)}</strong><select name="status" defaultValue={orderStatuses.includes(order.status) ? order.status : "processing"} disabled={busy === order.id}>{orderStatuses.map((status) => <option key={status} value={status}>{status.replace("_", " ")}</option>)}</select><input name="carrier" defaultValue={order.carrier ?? ""} placeholder="Carrier (e.g. Pos Laju)" /><input name="trackingNumber" defaultValue={order.trackingNumber ?? ""} placeholder="Tracking number" /><button className="button button-primary" disabled={busy === order.id}>Save fulfillment</button></form></article>; })}</div>}</section>
  </div>;
}
