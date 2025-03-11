import { db } from "../config/db";
import { eq } from "drizzle-orm";
import { users } from "../schemas/users.schema";
import { products } from "../schemas/products.schema";
import { NewUser, User } from "../entities/user.entitie";

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
          companyId: true
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
          companyId: true,
          refreshToken: true,
          createdAt: true
        },
      });
    } catch (err) {
      throw new Error("Impossible de récupérer l'utilisateur")
    }
  },

  updateById (id: string, updatedUser: Partial<User>) {
    try {
      return db.update(users)
        .set(updatedUser)
        .where(eq(users.id, id))
        .returning({ id: users.id, name: users.name, email: users.email, company: users.companyId })
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

  async getByEmail(email: string) {
    try {
      console.log('Début getByEmail, email:', email);
      
      const foundUsers = await db.select()
        .from(users)
        .where(eq(users.email, email));
      
      console.log('Requête DB réussie, résultats:', foundUsers.length);
      
      return foundUsers.length > 0 ? foundUsers[0] : null;
    }
    catch (err: any) {
      console.error('Erreur dans getByEmail:', err);
      throw new Error(`Erreur de base de données: ${err.message}`);
    }
  },

  async getCompany (id: string) {
    try {
      const result = await db.query.users.findFirst({
        where: eq(users.id, id),
        columns: {
          companyId: true
        }
      });

      return result;
    }
    catch (err) {
      throw new Error("Impossible de récupérer l'entreprise de l'utilisateur");
    }
  }
};