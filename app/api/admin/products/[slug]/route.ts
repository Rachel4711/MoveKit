import { authorizeAdminRequest } from "@/lib/admin";
import { deleteProduct, getProductBySlug, updateProduct } from "@/db/products";
import { productFromFormData } from "@/lib/product-form";
import { deleteProductImage } from "@/lib/product-images";

type RouteContext = { params: Promise<{ slug: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  if (!await authorizeAdminRequest()) return Response.json({ error: "Forbidden." }, { status: 403 });
  const { slug } = await context.params;
  const existing = await getProductBySlug(slug);
  if (!existing) return Response.json({ error: "Product not found." }, { status: 404 });
  try {
    const product = await productFromFormData(await request.formData(), existing.image);
    await updateProduct(slug, product);
    if (product.image !== existing.image) await deleteProductImage(existing.image);
    return Response.json({ product: { ...product, slug } });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Unable to update product." }, { status: 400 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  if (!await authorizeAdminRequest()) return Response.json({ error: "Forbidden." }, { status: 403 });
  const { slug } = await context.params;
  const existing = await getProductBySlug(slug);
  if (!existing) return Response.json({ error: "Product not found." }, { status: 404 });
  await deleteProduct(slug);
  await deleteProductImage(existing.image);
  return Response.json({ deleted: true });
}
