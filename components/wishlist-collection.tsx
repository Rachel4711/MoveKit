"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import type { Product } from "@/lib/products";

export function WishlistCollection({ products }: { products: Product[] }) {
  const [slugs, setSlugs] = useState<string[]>([]);
  useEffect(() => {
    const sync = () => {
      try { setSlugs(JSON.parse(localStorage.getItem("movekit-wishlist") ?? "[]") as string[]); }
      catch { setSlugs([]); }
    };
    sync(); window.addEventListener("movekit-wishlist", sync);
    return () => window.removeEventListener("movekit-wishlist", sync);
  }, []);
  const saved = products.filter((product) => slugs.includes(product.slug));
  return saved.length ? <div className="product-grid">{saved.map((product) => <ProductCard key={product.slug} product={product} />)}</div> :
    <div className="orders-empty"><Heart /><h3>Your wishlist is empty.</h3><p>Save gear you want to compare or buy later.</p><Link className="button button-primary" href="/#shop">Explore gear</Link></div>;
}
