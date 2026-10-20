import { env } from "cloudflare:workers";

const allowedTypes = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/avif", "avif"],
]);
const maxImageBytes = 5 * 1024 * 1024;

function bucket() {
  const binding = (env as unknown as { BUCKET?: R2Bucket }).BUCKET;
  if (!binding) throw new Error("R2 image storage is unavailable.");
  return binding;
}

export async function uploadProductImage(file: File) {
  const extension = allowedTypes.get(file.type);
  if (!extension) throw new Error("Use a JPG, PNG, WebP, or AVIF image.");
  if (file.size === 0 || file.size > maxImageBytes) throw new Error("Images must be between 1 byte and 5 MB.");

  const key = `products/${crypto.randomUUID()}.${extension}`;
  await bucket().put(key, file.stream(), {
    httpMetadata: { contentType: file.type, cacheControl: "public, max-age=31536000, immutable" },
  });
  return `/api/images/${key}`;
}

export async function getProductImage(key: string) {
  return bucket().get(key);
}

export async function deleteProductImage(imageUrl: string) {
  const prefix = "/api/images/";
  if (!imageUrl.startsWith(prefix)) return;
  await bucket().delete(imageUrl.slice(prefix.length));
}
