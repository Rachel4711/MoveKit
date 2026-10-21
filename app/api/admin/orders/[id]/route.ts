import { z } from "zod";
import { authorizeAdminRequest } from "@/lib/admin";
import { getOrderById, updateOrderFulfillment } from "@/db/orders";
import { refundStripePayment } from "@/lib/stripe";

const statusSchema = z.object({
  status: z.enum(["processing", "shipped", "delivered", "cancelled", "refunded"]),
  carrier: z.string().trim().max(60).optional(),
  trackingNumber: z.string().trim().max(100).optional(),
});

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!await authorizeAdminRequest()) return Response.json({ error: "Forbidden." }, { status: 403 });
  const parsed = statusSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Invalid order status." }, { status: 400 });
  const { id } = await context.params;
  if (parsed.data.status === "refunded") {
    const order = await getOrderById(id);
    if (!order?.paymentIntentId) return Response.json({ error: "This order has no refundable Stripe payment." }, { status: 409 });
    try { await refundStripePayment(order.paymentIntentId, order.id); }
    catch (error) { return Response.json({ error: error instanceof Error ? error.message : "Refund failed." }, { status: 400 }); }
  }
  await updateOrderFulfillment(id, parsed.data);
  return Response.json({ updated: true });
}
