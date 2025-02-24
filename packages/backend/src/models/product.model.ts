import { db } from "../config/db";
import { eq } from "drizzle-orm";
import { products } from "../schemas/products.schema";
import { NewProduct, Product } from "../entities/product.entitie";

export const productModel = {
  getAll (): Promise< Partial<Product>[]> {
    try {
      return db.query.products.findMany({
        columns: {
          id: true,
          name: true,
          description: true,
          quantity: true,
          imageUrl: true,
          status: true,
          price: true
        }
      });
    } catch(err) {
      throw new Error("Impossible de récupérer les produits")
    }
  },

  getProductById (id: number) {
    try {
      return db.query.products.findFirst({
        where: eq(products.id, id),
        columns: {
          id: true,
          name: true,
          price: true
        },
      });
    } catch (err) {
      throw new Error("Impossible de récupérer le produit")
    }
  },

  createProduct (product: NewProduct) {
    try {
        return db.insert(products).values(product).returning({ id: products.id }).execute();
    } catch (err) {
        throw new Error("Impossible de créer le produit")
    }
  },

  async updateById (id: number, updatedProduct: Partial<NewProduct>) {
    try {
      const existingProduct = await db.query.products.findFirst({
        where: eq(products.id, id),
        columns: { id: true },
      });

      if (!existingProduct) {
        throw new Error("Produit non trouvé");
      }

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

  async deleteById (id: number) {
    try {
      const existingProduct = await db.query.products.findFirst({
        where: eq(products.id, id),
        columns: { id: true },
      });

      if (!existingProduct) {
        throw new Error("Produit non trouvé");
      }

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