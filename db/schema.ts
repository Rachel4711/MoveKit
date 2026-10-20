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

export const orders = sqliteTable("orders", {
  id: text("id").primaryKey(),
  stripeSessionId: text("stripe_session_id").unique(),
  status: text("status").notNull().default("pending"),
  customerEmail: text("customer_email"),
  currency: text("currency").notNull().default("usd"),
  subtotalInCents: integer("subtotal_in_cents").notNull(),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

// Order items keep a purchase-time snapshot so later product edits do not
// rewrite the customer's order history.
export const orderItems = sqliteTable("order_items", {
  id: text("id").primaryKey(),
  orderId: text("order_id").notNull().references(() => orders.id),
  productSlug: text("product_slug").notNull(),
  productName: text("product_name").notNull(),
  variant: text("variant").notNull(),
  unitPriceInCents: integer("unit_price_in_cents").notNull(),
  quantity: integer("quantity").notNull(),
});
