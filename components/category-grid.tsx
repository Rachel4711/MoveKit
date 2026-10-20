import { ArrowUpRight } from "lucide-react";
import { categories } from "@/lib/products";

export function CategoryGrid() {
  return <section className="section category-section" aria-labelledby="category-title">
    <div className="section-heading"><div><span className="eyebrow">Find your focus</span><h2 id="category-title">Shop by goal</h2></div><p>Simple tools for every kind of movement.</p></div>
    <div className="category-grid">{categories.map((category) => <a className={`category-card category-${category.name.toLowerCase()}`} id={category.name.toLowerCase()} href="#shop" key={category.name}><span>{category.number}</span><div><h3>{category.name}</h3><p>{category.copy}</p></div><ArrowUpRight /></a>)}</div>
  </section>;
}
