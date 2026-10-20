import { z } from "zod";
import type { Product } from "@/lib/products";
import { uploadProductImage } from "@/lib/product-images";

const productFields = z.object({
  slug: z.string().trim().min(2).max(80).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  name: z.string().trim().min(2).max(120),
  category: z.enum(["Strength", "Mobility", "Cardio", "Recovery"]),
  price: z.coerce.number().positive().max(100000),
  description: z.string().trim().min(10).max(1000),
  imageUrl: z.string().trim().optional(),
  accent: z.string().trim().min(2).max(30),
  badge: z.string().trim().max(40).optional(),
  variants: z.string().trim().min(1),
  inventory: z.coerce.number().int().min(0).max(100000),
  featured: z.boolean(),
});

export async function productFromFormData(formData: FormData, existingImage?: string): Promise<Product> {
  const values = productFields.parse({
    slug: formData.get("slug"),
    name: formData.get("name"),
    category: formData.get("category"),
    price: formData.get("price"),
    description: formData.get("description"),
    imageUrl: formData.get("imageUrl") || undefined,
    accent: formData.get("accent") || "lime",
    badge: formData.get("badge") || undefined,
    variants: formData.get("variants"),
    inventory: formData.get("inventory"),
    featured: formData.get("featured") === "true",
  });
  const imageFile = formData.get("image");
  const uploadedImage = imageFile instanceof File && imageFile.size > 0
    ? await uploadProductImage(imageFile)
    : undefined;
  const image = uploadedImage ?? values.imageUrl ?? existingImage;
  if (!image) throw new Error("Provide an image file or image URL.");
  if (!image.startsWith("/api/images/") && !URL.canParse(image)) throw new Error("Image URL is invalid.");

  return {
    slug: values.slug,
    name: values.name,
    category: values.category,
    price: Math.round(values.price * 100) / 100,
    description: values.description,
    image,
    accent: values.accent,
    badge: values.badge || undefined,
    variants: values.variants.split(",").map((variant) => variant.trim()).filter(Boolean),
    inventory: values.inventory,
    featured: values.featured,
  };
}
