import { db } from "../config/db";
import { and, eq, inArray } from "drizzle-orm";
import { products } from "../schemas/products.schema";
import { NewProduct, Product } from "../entities/product.entitie";
import { saleItems } from "../schemas";

export const productModel = {
  create (product: NewProduct) {
    try {
        return db.insert(products).values(product).returning({ id: products.id }).execute();
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(`Impossible de créer le produit: ${err.message}`);
      } else {
        throw new Error("Impossible de créer le produit: erreur inconnue");
      }    }
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
      if (err instanceof Error) {
        throw new Error(`Impossible de récupérer les produits: ${err.message}`);
      } else {
        throw new Error("Impossible de récupérer les produits: erreur inconnue");
      }    }
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
      if (err instanceof Error) {
        throw new Error(`Impossible de récupérer le produit: ${err.message}`);
      } else {
        throw new Error("Impossible de récupérer le produit: erreur inconnue");
      }
    }
  },

  getPrice (id: string) {
    try {
      return db.query.products.findFirst({
        where: eq(products.id, id),
        columns: {
          price: true,
        },
      });
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(`Impossible de récupérer le prix du produit: ${err.message}`);
      } else {
        throw new Error("Impossible de récupérer le prix du produit: erreur inconnue");
      }
    }
  },

  async verifyProductOwner (productId: string, companyId: string) {
    try {
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
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(`Impossible de récupérer le companyId du produit: ${err.message}`);
      } else {
        throw new Error("Impossible de récupérer le companyId du produit: erreur inconnue");
      }
    }
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
      if (err instanceof Error) {
        throw new Error(`Impossible de supprimer le produit: ${err.message}`);
      } else {
        throw new Error("Impossible de supprimer à jour le produit: erreur inconnue");
      }
    }
  },

  async isProductUsedInSales(productId: string) {
    try {
      const saleItem = await db.query.saleItems.findFirst({
        where: eq(saleItems.productId, productId)
      });
      
      return !!saleItem;
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(`Impossible de récupérer le produit dans les ventes: ${err.message}`);
      } else {
        throw new Error("Impossible de récupérer le produit dans les ventes: erreur inconnue");
      }
    }
  },

  async getProductsByIds (productIds: string[], companyId: string) {
    try {
          return await db.query.products.findMany({
      where: and(
        inArray(products.id, productIds),
        eq(products.companyId, companyId)
      )
    });
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(`Impossible de récupérer les produits: ${err.message}`);
      } else {
        throw new Error("Impossible de récupérer les produits: erreur inconnue");
      }
    }
  }
};