import { z } from "zod";
import { getChatGPTUser } from "@/app/chatgpt-auth";
import { createAddress } from "@/db/addresses";

const schema = z.object({
  label: z.string().trim().min(1).max(30), recipient: z.string().trim().min(2).max(80),
  phone: z.string().trim().min(7).max(25), line1: z.string().trim().min(3).max(120),
  line2: z.string().trim().max(120).optional(), city: z.string().trim().min(2).max(60),
  state: z.string().trim().min(2).max(60), postalCode: z.string().trim().min(4).max(12),
  country: z.literal("MY").default("MY"),
});

export async function POST(request: Request) {
  const user = await getChatGPTUser();
  if (!user) return Response.json({ error: "Please sign in." }, { status: 401 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Please provide a complete Malaysian address." }, { status: 400 });
  await createAddress(user.userId, parsed.data);
  return Response.json({ created: true }, { status: 201 });
}
