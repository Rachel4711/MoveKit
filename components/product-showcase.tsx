"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import type { Product } from "@/lib/products";

const filters = ["All", "Strength", "Mobility", "Cardio", "Recovery"];

export function ProductShowcase({ products }: { products: Product[] }) {
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("featured");
  const [inStockOnly, setInStockOnly] = useState(false);
  const visibleProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return products
      .filter((product) => filter === "All" || product.category === filter)
      .filter((product) => !inStockOnly || product.inventory > 0)
      .filter((product) => !normalizedQuery || `${product.name} ${product.description} ${product.category}`.toLowerCase().includes(normalizedQuery))
      .toSorted((first, second) => {
        if (sort === "price-low") return first.price - second.price;
        if (sort === "price-high") return second.price - first.price;
        if (sort === "name") return first.name.localeCompare(second.name);
        return Number(second.featured) - Number(first.featured);
      });
  }, [filter, inStockOnly, products, query, sort]);
  return <section className="section product-section" id="shop" aria-labelledby="products-title">
    <div className="section-heading"><div><span className="eyebrow">Tested for real life</span><h2 id="products-title">MoveKit essentials</h2></div><p>Considered design, compact storage, and zero wasted space.</p></div>
    <div className="filter-row" aria-label="Filter products">{filters.map((item) => <button key={item} className={filter === item ? "filter active" : "filter"} onClick={() => setFilter(item)}>{item}</button>)}</div>
    <div className="catalog-controls"><label className="catalog-search"><Search size={17} /><span className="sr-only">Search products</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search gear" /></label><label>Sort<select value={sort} onChange={(event) => setSort(event.target.value)}><option value="featured">Featured</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="name">Name</option></select></label><label className="stock-filter"><input type="checkbox" checked={inStockOnly} onChange={(event) => setInStockOnly(event.target.checked)} /> In stock only</label></div>
    {visibleProducts.length > 0 ? <div className="product-grid">{visibleProducts.map((product) => <ProductCard key={product.slug} product={product} />)}</div> : <div className="catalog-empty"><h3>No gear found.</h3><p>Try another search or clear your filters.</p><button className="button button-light" onClick={() => { setQuery(""); setFilter("All"); setInStockOnly(false); }}>Clear filters</button></div>}
  </section>;
}
