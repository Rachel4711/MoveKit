import { Benefits } from "@/components/benefits";
import { CategoryGrid } from "@/components/category-grid";
import { Hero } from "@/components/hero";
import { KitBuilder } from "@/components/kit-builder";
import { Newsletter } from "@/components/newsletter";
import { ProductShowcase } from "@/components/product-showcase";
import { getProducts } from "@/db/products";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ checkout?: string }>;
}) {
  const products = await getProducts();
  const checkoutCancelled = (await searchParams).checkout === "cancelled";
  return <main>
    {checkoutCancelled && <div className="checkout-notice" role="status">
      Checkout was cancelled. Your items are still in your bag.
    </div>}
    <Hero /><CategoryGrid /><ProductShowcase products={products} /><Benefits /><KitBuilder /><Newsletter />
  </main>;
}
