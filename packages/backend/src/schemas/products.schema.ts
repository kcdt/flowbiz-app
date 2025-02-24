import { pgTable, serial, varchar, integer, decimal, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./users.schema";

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: varchar('description', { length: 1000 }),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  quantity: integer('quantity').notNull().default(1),
  status: varchar('status', { length: 50 }).notNull().default('available'),
  imageUrl: varchar('image_url', { length: 255 }), // image URL sur Cloudinary
  userId: uuid('user_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});