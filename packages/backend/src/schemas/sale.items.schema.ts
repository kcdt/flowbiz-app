import { pgTable, integer, uuid, decimal } from 'drizzle-orm/pg-core';
import { sales } from './sales.schema';
import { products } from './products.schema';

export const saleItems = pgTable('sale_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  quantity: integer('quantity').notNull(),
  unitPrice: decimal('unit_price', { precision: 10, scale: 2 }).notNull(),
  saleId: uuid('sale_id').notNull().references(() => sales.id),
  productId: uuid('product_id').notNull().references(() => products.id),
});