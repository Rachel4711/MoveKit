import { Benefits } from "@/components/benefits";
import { CategoryGrid } from "@/components/category-grid";
import { Hero } from "@/components/hero";
import { KitBuilder } from "@/components/kit-builder";
import { Newsletter } from "@/components/newsletter";
import { ProductShowcase } from "@/components/product-showcase";
import { getProducts } from "@/db/products";

export default async function HomePage() {
  const products = await getProducts();
  return <main><Hero /><CategoryGrid /><ProductShowcase products={products} /><Benefits /><KitBuilder /><Newsletter /></main>;
}
