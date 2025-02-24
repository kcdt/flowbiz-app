import { relations } from "drizzle-orm";
import { products, users } from ".";

export const usersRelations = relations(users, ({ many }) => ({
  products: many(products, (user, product) => product.userId.equals(user.id)),
}));

export const usersIndexes = indexes(users, ({ uniqueIndex }) => [
  uniqueIndex('users_email_idx').on(users.email),
]);