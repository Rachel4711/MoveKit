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

  async function setOrderStatus(orderId: string, status: string) {
    if (!status) return;
    setBusy(orderId); setMessage("");
    const response = await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }),
    });
    setBusy("");
    if (!response.ok) return setMessage("Order update failed.");
    setMessage("Order status updated."); router.refresh();
  }

  return <div className="admin-dashboard">
    {message && <p className="admin-message" role="status">{message}</p>}
    <section><h2>Add product</h2><form onSubmit={(event) => { event.preventDefault(); void submitProduct(event.currentTarget); }}><ProductFields /><button className="button button-primary" disabled={busy === "new"}>{busy === "new" ? "Saving…" : "Create product"}</button></form></section>
    <section><h2>Manage products</h2><div className="admin-product-list">{products.map((product) => <details key={product.slug}><summary><strong>{product.name}</strong><span>{product.inventory} in stock · ${product.price}</span></summary><form onSubmit={(event) => { event.preventDefault(); void submitProduct(event.currentTarget, product.slug); }}><ProductFields product={product} /><div className="admin-actions"><button className="button button-primary" disabled={busy === product.slug}>Save changes</button><button type="button" className="button button-danger" onClick={() => void removeProduct(product.slug)}>Delete</button></div></form></details>)}</div></section>
    <section><h2>Manage orders</h2>{orders.length === 0 ? <p className="admin-muted">No orders yet.</p> : <div className="admin-order-list">{orders.map((order) => <article key={order.id}><div><strong>#{order.id.slice(0, 8).toUpperCase()}</strong><span>{order.customerEmail ?? "No customer email"}</span><small>{order.items.map((item) => `${item.productName} (${item.variant}) × ${item.quantity}`).join(", ")}</small></div><div><strong>${(order.subtotalInCents / 100).toFixed(2)}</strong><select value={orderStatuses.includes(order.status) ? order.status : ""} disabled={busy === order.id} onChange={(event) => void setOrderStatus(order.id, event.target.value)}><option value="" disabled>{order.status.replace("_", " ")}</option>{orderStatuses.map((status) => <option key={status} value={status}>{status.replace("_", " ")}</option>)}</select></div></article>)}</div>}</section>
  </div>;
}
