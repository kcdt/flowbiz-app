import { relations } from "drizzle-orm";
import { products, users } from ".";

export const usersRelations = relations(users, ({ many }) => ({
  products: many(products),
}));