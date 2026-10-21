import { desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { reviews } from "@/db/schema";

export async function getReviews(productSlug: string) {
  return getDb().select().from(reviews)
    .where(eq(reviews.productSlug, productSlug))
    .orderBy(desc(reviews.createdAt));
}

export async function saveReview(values: {
  userId: string;
  productSlug: string;
  customerName: string;
  rating: number;
  title: string;
  body: string;
}) {
  await getDb().insert(reviews).values({
    id: crypto.randomUUID(),
    ...values,
    createdAt: new Date().toISOString(),
  }).onConflictDoUpdate({
    target: [reviews.userId, reviews.productSlug],
    set: {
      customerName: values.customerName,
      rating: values.rating,
      title: values.title,
      body: values.body,
      createdAt: new Date().toISOString(),
    },
  });
}
