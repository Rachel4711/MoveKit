import { asc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { products as productsTable } from "@/db/schema";
import { seedProducts, type Product } from "@/lib/products";

type ProductRow = typeof productsTable.$inferSelect;

function toProduct(row: ProductRow): Product {
  return {
    ...row,
    category: row.category as Product["category"],
    price: row.priceInCents / 100,
    badge: row.badge ?? undefined,
    variants: JSON.parse(row.variantsJson) as string[],
  };
}

function toInsert(product: Product): typeof productsTable.$inferInsert {
  return {
    slug: product.slug,
    name: product.name,
    category: product.category,
    priceInCents: Math.round(product.price * 100),
    description: product.description,
    image: product.image,
    accent: product.accent,
    badge: product.badge ?? null,
    variantsJson: JSON.stringify(product.variants),
    inventory: product.inventory,
    featured: product.featured,
  };
}

async function seedWhenEmpty() {
  const db = getDb();
  const existing = await db.select({ slug: productsTable.slug }).from(productsTable).limit(1);
  if (existing.length === 0) {
    await db.insert(productsTable).values(seedProducts.map(toInsert)).onConflictDoNothing();
  }
  return db;
}

function isMissingLocalBinding(error: unknown) {
  return error instanceof Error && error.message.includes("D1 binding `DB` is unavailable");
}

export async function getProducts(): Promise<Product[]> {
  try {
    const db = await seedWhenEmpty();
    const rows = await db.select().from(productsTable).orderBy(asc(productsTable.name));
    return rows.map(toProduct);
  } catch (error) {
    // The fallback is intentionally limited to local previews without D1.
    if (isMissingLocalBinding(error)) return seedProducts;
    throw error;
  }
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  try {
    const db = await seedWhenEmpty();
    const [row] = await db.select().from(productsTable).where(eq(productsTable.slug, slug)).limit(1);
    return row ? toProduct(row) : undefined;
  } catch (error) {
    if (isMissingLocalBinding(error)) return seedProducts.find((product) => product.slug === slug);
    throw error;
  }
}

export async function createProduct(product: Product) {
  await getDb().insert(productsTable).values(toInsert(product));
}

export async function updateProduct(slug: string, product: Product) {
  await getDb().update(productsTable).set(toInsert({ ...product, slug })).where(eq(productsTable.slug, slug));
}

export async function deleteProduct(slug: string) {
  await getDb().delete(productsTable).where(eq(productsTable.slug, slug));
}
