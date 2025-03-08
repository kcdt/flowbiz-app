import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';
import { companies } from '../schemas';

export const productCategories = pgTable('product_categories', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  description: varchar('description', { length: 500 }),
  companyId: uuid('company_id').notNull().references(() => companies.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});