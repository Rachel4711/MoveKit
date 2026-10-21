import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Check } from "lucide-react";
import { notFound } from "next/navigation";
import { ProductPurchase } from "@/components/product-purchase";
import { getProductBySlug } from "@/db/products";
import { getChatGPTUser } from "@/app/chatgpt-auth";
import { getReviews } from "@/db/reviews";
import { hasPurchasedProduct } from "@/db/orders";
import { ReviewSection } from "@/components/review-section";
import { WishlistButton } from "@/components/wishlist-button";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const product = await getProductBySlug((await params).slug);
  if (!product) notFound();
  const user = await getChatGPTUser();
  const [reviews, canReview] = await Promise.all([getReviews(product.slug), user ? hasPurchasedProduct(user.userId, product.slug) : false]);
  return <main className="product-page"><Link href="/#shop" className="back-link"><ArrowLeft size={17} /> Back to shop</Link><div className="product-detail"><div className={`detail-image accent-${product.accent}`}><Image src={product.image} alt={`${product.name} by MoveKit`} fill priority sizes="(max-width: 900px) 100vw, 55vw" /></div><div className="detail-copy"><span className="eyebrow">{product.category} / MoveKit</span><h1>{product.name}</h1><p className="detail-price">${product.price}.00</p><p className="detail-description">{product.description} Designed to pack easily, set up quickly, and keep your routine moving wherever you are.</p><ProductPurchase product={product} /><WishlistButton slug={product.slug} /><div className="detail-notes"><span><Check /> Free shipping over $75</span><span><Check /> 30-day returns</span><span><Check /> One-year MoveKit guarantee</span></div></div></div><ReviewSection productSlug={product.slug} reviews={reviews} canReview={canReview} /></main>;
}
