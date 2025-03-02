import { pgTable, varchar, integer, decimal, timestamp, uuid } from "drizzle-orm/pg-core";
import { companies } from "./companies.schema";

export const products = pgTable('products', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: varchar('description', { length: 1000 }).notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  quantity: integer('quantity').notNull().default(0),
  imageUrl: varchar('image_url', { length: 255 }),
  companyId: uuid('company_id').references(() => companies.id).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});