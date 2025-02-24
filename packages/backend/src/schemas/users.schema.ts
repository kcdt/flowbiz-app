import { pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", [
  "seller",
  "supplier",
]);

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  status: userRoleEnum().default("seller"),
  phone: varchar('phone', { length: 255 }).notNull(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  refreshToken: varchar('refresh_token', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});