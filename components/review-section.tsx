"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";

type Review = { id: string; customerName: string; rating: number; title: string; body: string; createdAt: string };

export function ReviewSection({ productSlug, reviews, canReview }: { productSlug: string; reviews: Review[]; canReview: boolean }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const average = reviews.length ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0;
  async function submit(form: HTMLFormElement) {
    const data = new FormData(form);
    const response = await fetch("/api/reviews", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ productSlug, rating: Number(data.get("rating")), title: data.get("title"), body: data.get("body") }) });
    const result = await response.json() as { error?: string };
    if (!response.ok) return setMessage(result.error ?? "Could not save review.");
    setMessage("Review saved. Thank you!"); form.reset(); router.refresh();
  }
  return <section className="reviews-section"><header><div><span className="eyebrow">Community tested</span><h2>Reviews</h2></div><strong>{reviews.length ? `${average.toFixed(1)} / 5` : "New arrival"}</strong></header>
    <div className="reviews-layout"><div className="review-list">{reviews.length ? reviews.map((review) => <article key={review.id}><div className="review-stars" aria-label={`${review.rating} out of 5 stars`}>{Array.from({ length: 5 }, (_, index) => <Star key={index} fill={index < review.rating ? "currentColor" : "none"} />)}</div><h3>{review.title}</h3><p>{review.body}</p><small>{review.customerName} · Verified buyer · {new Date(review.createdAt).toLocaleDateString("en-MY")}</small></article>) : <p className="admin-muted">No reviews yet. Verified buyers can be first.</p>}</div>
      {canReview ? <form className="review-form" onSubmit={(event) => { event.preventDefault(); void submit(event.currentTarget); }}><h3>Share your experience</h3><label>Rating<select name="rating" defaultValue="5">{[5,4,3,2,1].map((value) => <option value={value} key={value}>{value} stars</option>)}</select></label><label>Title<input name="title" required maxLength={80} /></label><label>Review<textarea name="body" required minLength={10} maxLength={800} /></label><button className="button button-primary">Publish review</button>{message && <p role="status">{message}</p>}</form> : <div className="review-locked"><h3>Verified reviews only</h3><p>Purchase this product to share a review.</p></div>}
    </div></section>;
}
