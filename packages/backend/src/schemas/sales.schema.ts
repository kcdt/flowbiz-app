import { pgTable, pgEnum, varchar, uuid, timestamp, decimal } from 'drizzle-orm/pg-core';
import { companies } from './companies.schema';
import { sql } from 'drizzle-orm';

export const saleStatusEnum = pgEnum("sale_status", [
  "pending",
  "completed",
  "cancelled",
  "refunded"
]);

export const sales = pgTable('sales', {
  id: uuid('id').defaultRandom().primaryKey(),
  date: varchar('date', { length: 50 }).default(sql`TO_CHAR(CURRENT_TIMESTAMP AT TIME ZONE 'UTC', 'DD-MM-YYYY')`).notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  status: saleStatusEnum('status').default("pending").notNull(),
  buyerName: varchar('buyer_name', { length: 255 }).notNull(),
  buyerAddress: varchar('buyer_address', { length: 500 }).notNull(),
  companyId: uuid('company_id').references(() => companies.id).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});