import { db } from "../config/db";
import { eq } from "drizzle-orm";
import { users } from "../schemas/users.schema";
import { products } from "../schemas/products.schema";
import { NewUser } from "../entities/user.entitie";

export const userModel = {
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
          refreshToken: true,
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

  updateById (id: string, updatedUser: Partial<NewUser>) {
    try {
      return db.update(users)
        .set(updatedUser)
        .where(eq(users.id, id))
        .returning({ id: users.id })
        .execute();

    } catch (err) {
      throw new Error("Impossible de mettre à jour l'utilisateur");
    }
  },

  deleteById (id: string) {
    try {
      return db.delete(users)
        .where(eq(users.id, id))
        .returning({ id: users.id })
        .execute();

    } catch (err) {
      throw new Error("Impossible de supprimer l'utilisateur");
    }
  },

  async getCompanyId (id: string): Promise<string | null> {
    try {
      const result = await db.query.users.findFirst({
        where: eq(users.id, id),
        columns: {
          companyId: true,
        }
      });

      return result?.companyId || null;
    } catch(err) {
      throw new Error(`Impossible de récupérer l'entreprise de l'utilisateur ${id}`)
    }
  },

  async getByEmail (email: string) {
    try {
      const foundUsers = await db.select()
        .from(users)
        .where(eq(users.email, email));
      
      return foundUsers.length > 0 ? foundUsers[0] : null;
    }
    catch (err) {
      throw new Error("Impossible de récupérer l'utilisateur");
    }
  },
};