import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const products = sqliteTable("products", {
  slug: text("slug").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  priceInCents: integer("price_in_cents").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  accent: text("accent").notNull(),
  badge: text("badge"),
  variantsJson: text("variants_json").notNull().default("[]"),
  inventory: integer("inventory").notNull().default(0),
  featured: integer("featured", { mode: "boolean" }).notNull().default(false),
});
