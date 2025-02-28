import { pgTable, pgEnum, varchar, uuid, timestamp, decimal } from 'drizzle-orm/pg-core';
import { companies } from './companies.schema';

export const saleStatusEnum = pgEnum("sale_status", [
  "pending",
  "completed",
  "cancelled",
  "refunded"
]);

export const sales = pgTable('sales', {
  id: uuid('id').defaultRandom().primaryKey(),
  date: timestamp('date').defaultNow().notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  status: saleStatusEnum('status').default("pending"),
  buyerName: varchar('buyer_name', { length: 255 }),
  buyerAddress: varchar('buyer_address', { length: 500 }),
  companyId: uuid('company_id').references(() => companies.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});