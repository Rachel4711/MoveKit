"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Trash2 } from "lucide-react";

type Address = { id: string; label: string; recipient: string; phone: string; line1: string; line2: string | null; city: string; state: string; postalCode: string; country: string };

export function AddressBook({ addresses }: { addresses: Address[] }) {
  const router = useRouter(); const [message, setMessage] = useState("");
  async function create(form: HTMLFormElement) {
    const data = Object.fromEntries(new FormData(form));
    const response = await fetch("/api/addresses", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...data, country: "MY" }) });
    const result = await response.json() as { error?: string };
    if (!response.ok) return setMessage(result.error ?? "Could not save address.");
    form.reset(); setMessage("Address saved."); router.refresh();
  }
  async function remove(id: string) { await fetch(`/api/addresses/${id}`, { method: "DELETE" }); router.refresh(); }
  return <section className="address-book" aria-labelledby="addresses-heading"><div className="section-heading account-section-heading"><div><span className="eyebrow">Faster reference</span><h2 id="addresses-heading">Saved addresses</h2></div><p>Keep delivery details in your account. Stripe still confirms the address securely at checkout.</p></div><div className="address-layout"><div className="address-list">{addresses.map((address) => <article key={address.id}><MapPin /><div><strong>{address.label}</strong><span>{address.recipient} · {address.phone}</span><p>{address.line1}{address.line2 ? `, ${address.line2}` : ""}<br />{address.postalCode} {address.city}, {address.state}, {address.country}</p></div><button className="icon-button" onClick={() => void remove(address.id)} aria-label={`Delete ${address.label}`}><Trash2 /></button></article>)}</div><form className="address-form" onSubmit={(event) => { event.preventDefault(); void create(event.currentTarget); }}><h3>Add address</h3><div className="admin-fields"><label>Label<input name="label" placeholder="Home" required /></label><label>Recipient<input name="recipient" required /></label><label>Phone<input name="phone" required /></label><label>Address line 1<input name="line1" required /></label><label>Address line 2<input name="line2" /></label><label>City<input name="city" required /></label><label>State<input name="state" required /></label><label>Postcode<input name="postalCode" required /></label></div><button className="button button-primary">Save address</button>{message && <p role="status">{message}</p>}</form></div></section>;
}
