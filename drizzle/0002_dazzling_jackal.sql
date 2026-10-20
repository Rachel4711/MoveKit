CREATE TABLE `payment_events` (
	`id` text PRIMARY KEY NOT NULL,
	`processed_at` text NOT NULL
);
--> statement-breakpoint
ALTER TABLE `orders` ADD `user_id` text;