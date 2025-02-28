import { pgTable, varchar, uuid, timestamp } from 'drizzle-orm/pg-core';

export const companies = pgTable('companies', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  address: varchar('address', { length: 500 }),
  phone: varchar('phone', { length: 20 }),
  email: varchar('email', { length: 255 }),
  taxId: varchar('tax_id', { length: 50 }), // SIRET
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});