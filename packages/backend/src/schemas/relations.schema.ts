import { relations } from "drizzle-orm";
import { products, saleItems, sales, users } from ".";

export const usersRelations = relations(users, ({ many }) => ({
  products: many(products),
  sales: many(sales),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  user: one(users, {
    fields: [products.userId],
    references: [users.id],
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
  user: one(users, {
    fields: [sales.userId],
    references: [users.id],
  }),
  // company: one(companies, {
  //   fields: [sales.companyId],
  //   references: [companies.id],
  // }),
  items: many(saleItems),
}));