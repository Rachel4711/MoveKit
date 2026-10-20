"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/product-card";
import { products } from "@/lib/products";

const filters = ["All", "Strength", "Mobility", "Cardio", "Recovery"];

export function ProductShowcase() {
  const [filter, setFilter] = useState("All");
  const visibleProducts = useMemo(() => filter === "All" ? products : products.filter((product) => product.category === filter), [filter]);
  return <section className="section product-section" id="shop" aria-labelledby="products-title">
    <div className="section-heading"><div><span className="eyebrow">Tested for real life</span><h2 id="products-title">MoveKit essentials</h2></div><p>Considered design, compact storage, and zero wasted space.</p></div>
    <div className="filter-row" aria-label="Filter products">{filters.map((item) => <button key={item} className={filter === item ? "filter active" : "filter"} onClick={() => setFilter(item)}>{item}</button>)}</div>
    <div className="product-grid">{visibleProducts.map((product) => <ProductCard key={product.slug} product={product} />)}</div>
  </section>;
}
