import { db } from "../config/db";
import { eq } from "drizzle-orm";
import { users } from "../schemas/users.schema";
import { products } from "../schemas/products.schema";
import { NewUser } from "../entities/user.entitie";

export const userModel = {
  createUser (product: NewUser) {
    try {
        return db.insert(users).values(product).returning({ id: users.id }).execute();
    } catch (err) {
        throw new Error("Impossible de créer l'utilisateur")
    }
  },

  getByName (name: string) {
    try {
      return db.query.users.findFirst({
        where: eq(users.name, name),
        columns: {
          id: true,
          name: true,
          email: true,
          role: true,
          phone: true,
          createdAt: true,
          updatedAt: true,
        }
      });
    } catch(err) {
      throw new Error(`Impossible de récupérer l'utilisateur ${name}`)
    }
  },

  getById (id: string) {
    try {
      return db.query.users.findFirst({
        where: eq(users.id, id),
        columns: {
          id: true,
          name: true,
          email: true,
          role: true,
          phone: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (err) {
      throw new Error("Impossible de récupérer l'utilisateur")
    }
  },

  getUserProducts (id: string) {
    try {
      return db.query.products.findMany({
        where: eq(products.userId, id),
        columns: {
          id: true,
          name: true,
          description: true,
          price: true,
          quantity: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (err) {
      throw new Error("Impossible de récupérer les produits de l'utilisateur")
    }
  },

  async updateById (id: string, updatedUser: Partial<NewUser>) {
    try {
      const existingUser = await db.query.users.findFirst({
        where: eq(users.id, id),
        columns: { id: true },
      });

      if (!existingUser) {
        throw new Error("Utilisateur non trouvé");
      }

      const result = await db.update(users)
        .set(updatedUser)
        .where(eq(users.id, id))
        .returning({ id: users.id })
        .execute();

      return result;
    } catch (err) {
      throw new Error("Impossible de mettre à jour l'utilisateur");
    }
  },

  async deleteById (id: string) {
    try {
      const existingUser = await db.query.users.findFirst({
        where: eq(users.id, id),
        columns: { id: true },
      });

      if (!existingUser) {
        throw new Error("Utilisateur non trouvé");
      }

      const result = await db.delete(users)
        .where(eq(users.id, id))
        .returning({ id: users.id })
        .execute();

      return result;
    } catch (err) {
      throw new Error("Impossible de supprimer l'utilisateur");
    }
  }
};