import { db } from "../config/db";
import { and, eq } from "drizzle-orm";
import { products } from "../schemas/products.schema";
import { NewProduct, Product } from "../entities/product.entitie";

export const productModel = {
  create (product: NewProduct) {
    try {
        return db.insert(products).values(product).returning({ id: products.id }).execute();
    } catch (err) {
        throw new Error("Impossible de créer le produit")
    }
  },

  getAll (companyId: string): Promise< Partial<Product>[]> {
    try {
      return db.query.products.findMany({
        where: eq(products.companyId, companyId),
        columns: {
          id: true,
          name: true,
          description: true,
          quantity: true,
          imageUrl: true,
          price: true
        }
      });
    } catch(err) {
      throw new Error("Impossible de récupérer les produits")
    }
  },

  getById (id: string) {
    try {
      return db.query.products.findFirst({
        where: eq(products.id, id),
        columns: {
          id: true,
          name: true,
          description: true,
          quantity: true,
          imageUrl: true,
          price: true,
        },
      });
    } catch (err) {
      throw new Error("Impossible de récupérer le produit")
    }
  },

    async verifyProductOwner (productId: string, companyId: string) {
      const product = await db.select({
        companyId: products.companyId
      })
        .from(products)
        .where(and(eq(products.id, productId), eq(products.companyId, companyId)))
        .limit(1);
      
      if (product.length === 0) {
        throw new Error("Impossible de récupérer le produit, id incorrect");
      }
      
      if (!product[0].companyId) {
        throw new Error("Impossible de récupérer l'id de la company")
      }
      
      return {
        ...product[0],
      };
    },

  async existingProduct (id: string) {
    const product = await db.query.products.findFirst({
      where: eq(products.id, id),
      columns: { id: true },
    });
  
    if (!product) {
      throw new Error("Produit non trouvé");
    }
  },

  async updateById (id: string, updatedProduct: Partial<NewProduct>) {
    try {
      const result = await db.update(products)
        .set(updatedProduct)
        .where(eq(products.id, id))
        .returning({ id: products.id })
        .execute();

      return result;
    } catch (err) {
      throw new Error("Impossible de mettre à jour le produit");
    }
  },

  async deleteById (id: string) {
    try {
      const result = await db.delete(products)
        .where(eq(products.id, id))
        .returning({ id: products.id })
        .execute();

      return result;
    } catch (err) {
      throw new Error("Impossible de supprimer le produit");
    }
  }
};