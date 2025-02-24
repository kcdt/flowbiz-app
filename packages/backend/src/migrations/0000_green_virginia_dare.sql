CREATE TABLE "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" varchar(1000),
	"price" numeric(10, 2) NOT NULL,
	"quantity" integer DEFAULT 0 NOT NULL,
	"status" varchar(50) DEFAULT 'available' NOT NULL,
	"image_url" varchar(255),
	"user_id" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
