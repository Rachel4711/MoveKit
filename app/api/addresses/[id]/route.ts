import { getChatGPTUser } from "@/app/chatgpt-auth";
import { deleteAddress } from "@/db/addresses";

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const user = await getChatGPTUser();
  if (!user) return Response.json({ error: "Please sign in." }, { status: 401 });
  await deleteAddress(user.userId, (await context.params).id);
  return Response.json({ deleted: true });
}
