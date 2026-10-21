import { WishlistCollection } from "@/components/wishlist-collection";
import { getProducts } from "@/db/products";

export default async function WishlistPage() {
  const products = await getProducts();
  return <main className="account-page"><header className="account-heading"><div><span className="eyebrow">Saved locally</span><h1>Your wishlist.</h1><p>Keep your next MoveKit setup within reach.</p></div></header><section className="account-section-heading"><WishlistCollection products={products} /></section></main>;
}
