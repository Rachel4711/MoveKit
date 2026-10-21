import { integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

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
  userId: text("user_id"),
  stripeSessionId: text("stripe_session_id").unique(),
  status: text("status").notNull().default("pending"),
  customerEmail: text("customer_email"),
  customerName: text("customer_name"),
  customerPhone: text("customer_phone"),
  shippingAddressJson: text("shipping_address_json"),
  paymentIntentId: text("payment_intent_id"),
  carrier: text("carrier"),
  trackingNumber: text("tracking_number"),
  currency: text("currency").notNull().default("usd"),
  subtotalInCents: integer("subtotal_in_cents").notNull(),
  discountInCents: integer("discount_in_cents").notNull().default(0),
  totalInCents: integer("total_in_cents"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const reviews = sqliteTable("reviews", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  productSlug: text("product_slug").notNull().references(() => products.slug),
  customerName: text("customer_name").notNull(),
  rating: integer("rating").notNull(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  createdAt: text("created_at").notNull(),
}, (table) => [uniqueIndex("reviews_user_product_unique").on(table.userId, table.productSlug)]);

export const savedAddresses = sqliteTable("saved_addresses", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  label: text("label").notNull(),
  recipient: text("recipient").notNull(),
  phone: text("phone").notNull(),
  line1: text("line1").notNull(),
  line2: text("line2"),
  city: text("city").notNull(),
  state: text("state").notNull(),
  postalCode: text("postal_code").notNull(),
  country: text("country").notNull().default("MY"),
  createdAt: text("created_at").notNull(),
});

export const paymentEvents = sqliteTable("payment_events", {
  id: text("id").primaryKey(),
  processedAt: text("processed_at").notNull(),
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
