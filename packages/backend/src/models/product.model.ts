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
        with: {
          category: true
        },    
        columns: {
          id: true,
          name: true,
          description: true,
          categoryId: true,
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
          categoryId: true,
          quantity: true,
          imageUrl: true,
          price: true,
          createdAt: true,
          updatedAt: true
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

  async verifyProductOwner(productId: string, companyId: string) {
    try {
      const productExists = await db.select({
        id: products.id,
        productCompanyId: products.companyId
      })
        .from(products)
        .where(eq(products.id, productId))
        .limit(1);
      
      if (productExists.length === 0) {
        throw new Error(`Le produit avec l'ID ${productId} n'existe pas`);
      }
      
      if (productExists[0].productCompanyId !== companyId) {
        throw new Error(`Le produit avec l'ID ${productId} n'appartient pas à cette entreprise`);
      }
      
      return {
        ...productExists[0],
      };
    } catch (err) {
      if (err instanceof Error) {
        console.log(`Erreur pour le produit ID: ${productId}, Company ID: ${companyId}`);
        throw new Error(`Vérification du propriétaire du produit échouée: ${err.message}`);
      } else {
        throw new Error("Vérification du propriétaire du produit échouée: erreur inconnue");
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

  async existingProduct (id: string) {
    const product = await db.query.products.findFirst({
      where: eq(products.id, id),
      columns: { id: true },
    });
  
    if (!product) {
      throw new Error("Produit non trouvé");
    }
  },

  async existingProduct (id: string) {
    const product = await db.query.products.findFirst({ // passer en fonction pour la réutiliser
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

  async updateStock(productId: string, quantityChange: number) {
    try {
      const product = await db.select({ quantity: products.quantity })
        .from(products)
        .where(eq(products.id, productId))
        .execute()
        .then(res => res[0]);
      
      if (!product) {
        throw new Error(`Produit avec l'ID ${productId} non trouvé`);
      }
      
      const newQuantity = product.quantity + quantityChange;
      
      if (newQuantity < 0) {
        throw new Error(`Stock insuffisant pour le produit ${productId}. Quantité actuelle: ${product.quantity}, Changement demandé: ${quantityChange}`);
      }
      
      const result = await db.update(products)
        .set({ quantity: newQuantity })
        .where(eq(products.id, productId))
        .returning({ id: products.id, quantity: products.quantity })
        .execute();
      
      return result[0];
    } catch (err) {
      if (err instanceof Error) {
        throw err;
      }
      throw new Error(`Impossible de mettre à jour le stock du produit ${productId}`);
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