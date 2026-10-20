import { authorizeAdminRequest } from "@/lib/admin";
import { createProduct } from "@/db/products";
import { productFromFormData } from "@/lib/product-form";

export async function POST(request: Request) {
  if (!await authorizeAdminRequest()) return Response.json({ error: "Forbidden." }, { status: 403 });
  try {
    const product = await productFromFormData(await request.formData());
    await createProduct(product);
    return Response.json({ product }, { status: 201 });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Unable to create product." }, { status: 400 });
  }
}
