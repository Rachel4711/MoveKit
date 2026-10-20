"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import type { Product } from "@/lib/products";

export function ProductPurchase({ product }: { product: Product }) {
  const { addItem } = useCart();
  return <div className="purchase-panel"><span className="option-label">Choose intensity</span><div className="option-row"><button>Light</button><button className="selected">Medium</button><button>Strong</button></div><button className="button button-primary button-full" onClick={() => addItem(product)}>Add to bag <ShoppingBag size={18} /></button></div>;
}
