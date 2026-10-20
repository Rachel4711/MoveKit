"use client";

import { useEffect, useRef } from "react";
import { useCart } from "@/components/cart-provider";

export function OrderComplete() {
  const { clearCart } = useCart();
  const hasCleared = useRef(false);

  // Stripe redirects here only after Checkout completes, so the device-local
  // bag can be cleared while the webhook records the authoritative payment.
  useEffect(() => {
    if (hasCleared.current) return;
    hasCleared.current = true;
    clearCart();
  }, [clearCart]);

  return null;
}
