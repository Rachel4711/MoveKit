import { asc, and, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { savedAddresses } from "@/db/schema";

export type AddressInput = Omit<typeof savedAddresses.$inferInsert, "id" | "userId" | "createdAt">;

export async function getAddresses(userId: string) {
  return getDb().select().from(savedAddresses)
    .where(eq(savedAddresses.userId, userId)).orderBy(asc(savedAddresses.createdAt));
}

export async function createAddress(userId: string, address: AddressInput) {
  await getDb().insert(savedAddresses).values({
    id: crypto.randomUUID(), userId, ...address, createdAt: new Date().toISOString(),
  });
}

export async function deleteAddress(userId: string, id: string) {
  await getDb().delete(savedAddresses)
    .where(and(eq(savedAddresses.id, id), eq(savedAddresses.userId, userId)));
}
