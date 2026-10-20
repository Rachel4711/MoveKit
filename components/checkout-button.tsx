"use client";

import { useState } from "react";
import type { CartItem } from "@/components/cart-provider";

export function CheckoutButton({ items }: { items: CartItem[] }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function startCheckout() {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map(({ slug, variant, quantity }) => ({ slug, variant, quantity })),
        }),
      });
      const result = await response.json() as { url?: string; error?: string };
      if (!response.ok || !result.url) throw new Error(result.error ?? "Checkout is unavailable.");
      window.location.assign(result.url);
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : "Checkout is unavailable.");
      setIsLoading(false);
    }
  }

  return <>
    <button
      className="button button-primary button-full"
      disabled={!items.length || isLoading}
      onClick={startCheckout}
    >
      {isLoading ? "Opening secure checkout…" : "Checkout securely"}
    </button>
    {error && <p className="checkout-error" role="alert">{error}</p>}
  </>;
}
