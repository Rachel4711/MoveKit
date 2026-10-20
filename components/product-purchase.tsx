"use client";

import { useState } from "react";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import type { Product } from "@/lib/products";

export function ProductPurchase({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [variant, setVariant] = useState(product.variants[0]);
  return <div className="purchase-panel"><span className="option-label">Choose option</span><div className="option-row">{product.variants.map((option) => <button key={option} className={variant === option ? "selected" : ""} onClick={() => setVariant(option)}>{option}</button>)}</div><button className="button button-primary button-full" onClick={() => addItem(product, variant)}>Add to bag <ShoppingBag size={18} /></button><p className="stock-note">{product.inventory} available</p></div>;
}
