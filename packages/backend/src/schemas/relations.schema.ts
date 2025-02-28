import { relations } from "drizzle-orm";
import { products, saleItems, sales, users, companies } from "../schemas";

export const usersRelations = relations(users, ({ one }) => ({
  company: one(companies, {
    fields: [users.companyId],
    references: [companies.id],
  }),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  company: one(companies, {
    fields: [products.companyId],
    references: [companies.id],
  }),
  saleItems: many(saleItems),
}));

export const saleItemsRelations = relations(saleItems, ({ one }) => ({
  sale: one(sales, {
    fields: [saleItems.saleId],
    references: [sales.id],
  }),
  product: one(products, {
    fields: [saleItems.productId],
    references: [products.id],
  }),
}));

export const salesRelations = relations(sales, ({ one, many }) => ({
  company: one(companies, {
    fields: [sales.companyId],
    references: [companies.id],
  }),
  items: many(saleItems),
}));

// export const invoicesRelations = relations(invoices, ({ one }) => ({
//   sale: one(sales, {
//     fields: [invoices.saleId],
//     references: [sales.id],
//   }),
// }));