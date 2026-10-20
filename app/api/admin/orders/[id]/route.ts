import { z } from "zod";
import { authorizeAdminRequest } from "@/lib/admin";
import { updateOrderStatus } from "@/db/orders";

const statusSchema = z.object({ status: z.enum(["processing", "shipped", "delivered", "cancelled", "refunded"]) });

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!await authorizeAdminRequest()) return Response.json({ error: "Forbidden." }, { status: 403 });
  const parsed = statusSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Invalid order status." }, { status: 400 });
  const { id } = await context.params;
  await updateOrderStatus(id, parsed.data.status);
  return Response.json({ updated: true });
}
