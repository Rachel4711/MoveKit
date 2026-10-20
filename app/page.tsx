import { Benefits } from "@/components/benefits";
import { CategoryGrid } from "@/components/category-grid";
import { Hero } from "@/components/hero";
import { KitBuilder } from "@/components/kit-builder";
import { Newsletter } from "@/components/newsletter";
import { ProductShowcase } from "@/components/product-showcase";

export default function HomePage() {
  return <main><Hero /><CategoryGrid /><ProductShowcase /><Benefits /><KitBuilder /><Newsletter /></main>;
}
