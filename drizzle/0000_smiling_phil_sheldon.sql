CREATE TABLE `products` (
	`slug` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`category` text NOT NULL,
	`price_in_cents` integer NOT NULL,
	`description` text NOT NULL,
	`image` text NOT NULL,
	`accent` text NOT NULL,
	`badge` text,
	`variants_json` text DEFAULT '[]' NOT NULL,
	`inventory` integer DEFAULT 0 NOT NULL,
	`featured` integer DEFAULT false NOT NULL
);
