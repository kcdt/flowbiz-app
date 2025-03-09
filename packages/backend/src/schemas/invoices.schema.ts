import { pgTable, decimal, timestamp, uuid, pgEnum, varchar } from "drizzle-orm/pg-core";
import { sales, companies } from ".";

export const invoiceStatusEnum = pgEnum('invoice_status', [
  'draft',       // Facture en cours d'édition
  'issued',      // Facture émise au client
  'paid',        // Facture payée
  'cancelled',   // Facture annulée
  'overdue'      // Facture en retard de paiement
]);

export const invoices = pgTable('invoices', {
  id: uuid('id').defaultRandom().primaryKey(),
  invoiceNumber: varchar('invoice_number').notNull().unique(),
  issuedDate: timestamp('issued_date').defaultNow().notNull(),
  totalAmount: decimal('total_amount', { precision: 10, scale: 2 }).notNull(),
  status: invoiceStatusEnum('status').default("draft").notNull(),
  companyId: uuid('company_id').notNull().references(() => companies.id).notNull(),
  saleId: uuid('sale_id').notNull().references(() => sales.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});