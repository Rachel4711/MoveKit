import { z } from "zod";
import { getChatGPTUser } from "@/app/chatgpt-auth";
import { hasPurchasedProduct } from "@/db/orders";
import { saveReview } from "@/db/reviews";

const schema = z.object({
  productSlug: z.string().min(1).max(100),
  rating: z.number().int().min(1).max(5),
  title: z.string().trim().min(2).max(80),
  body: z.string().trim().min(10).max(800),
});

export async function POST(request: Request) {
  const user = await getChatGPTUser();
  if (!user) return Response.json({ error: "Please sign in to review a product." }, { status: 401 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Please complete every review field." }, { status: 400 });
  if (!await hasPurchasedProduct(user.userId, parsed.data.productSlug)) {
    return Response.json({ error: "Reviews are available after a verified purchase." }, { status: 403 });
  }
  await saveReview({
    ...parsed.data,
    userId: user.userId,
    customerName: user.displayName,
  });
  return Response.json({ saved: true });
}
