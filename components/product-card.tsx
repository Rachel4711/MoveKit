"use client";

import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import type { Product } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  return <article className="product-card">
    <Link href={`/products/${product.slug}`} className="product-image-link" aria-label={`View ${product.name}`}><div className={`product-image accent-${product.accent}`}><Image src={product.image} alt="" fill sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw" />{product.badge && <span className="product-badge">{product.badge}</span>}</div></Link>
    <div className="product-info"><div><span>{product.category}</span><Link href={`/products/${product.slug}`}><h3>{product.name}</h3></Link><strong>${product.price}</strong></div><button className="add-button" onClick={() => addItem(product, product.variants[0])} aria-label={`Add ${product.name} to cart`}><Plus /></button></div>
  </article>;
}
