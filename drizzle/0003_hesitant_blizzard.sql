CREATE TABLE `reviews` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`product_slug` text NOT NULL,
	`customer_name` text NOT NULL,
	`rating` integer NOT NULL,
	`title` text NOT NULL,
	`body` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`product_slug`) REFERENCES `products`(`slug`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `reviews_user_product_unique` ON `reviews` (`user_id`,`product_slug`);--> statement-breakpoint
CREATE TABLE `saved_addresses` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`label` text NOT NULL,
	`recipient` text NOT NULL,
	`phone` text NOT NULL,
	`line1` text NOT NULL,
	`line2` text,
	`city` text NOT NULL,
	`state` text NOT NULL,
	`postal_code` text NOT NULL,
	`country` text DEFAULT 'MY' NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
ALTER TABLE `orders` ADD `customer_name` text;--> statement-breakpoint
ALTER TABLE `orders` ADD `customer_phone` text;--> statement-breakpoint
ALTER TABLE `orders` ADD `shipping_address_json` text;--> statement-breakpoint
ALTER TABLE `orders` ADD `payment_intent_id` text;--> statement-breakpoint
ALTER TABLE `orders` ADD `carrier` text;--> statement-breakpoint
ALTER TABLE `orders` ADD `tracking_number` text;--> statement-breakpoint
ALTER TABLE `orders` ADD `discount_in_cents` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `orders` ADD `total_in_cents` integer;