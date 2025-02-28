import { db } from '../config/db';
import { sales, saleItems, products } from '../schemas';
import { eq, and, gte, lte, desc, SQL, sql } from 'drizzle-orm';
import { SaleFilters, SaleInput, SaleItemInput } from '../types/sale.types';

export const saleModel = {
  async create(saleData: SaleInput, items: SaleItemInput[]) {
    return await db.transaction(async (tx) => {
      const saleValues = {
        price: saleData.price.toString(),
        status: saleData.status as 'pending' | 'completed' | 'cancelled' | 'refunded' || 'pending',
        buyerName: saleData.buyerName,
        buyerAddress: saleData.buyerAddress,
        companyId: saleData.companyId
      };
      
      const [newSale] = await tx.insert(sales)
        .values(saleValues)
        .returning();

      const saleItemsData = items.map(item => ({
        quantity: item.quantity,
        unitPrice: item.unitPrice.toString(),
        saleId: newSale.id,
        productId: item.productId
      }));

      const saleItemsResult = await tx.insert(saleItems)
        .values(saleItemsData)
        .returning();

      // Vérication de la quantité de produit en stock
      for (const item of items) {
        const product = await tx.select()
          .from(products)
          .where(eq(products.id, item.productId))
          .limit(1);
        
        if (product.length === 0) {
          throw new Error("Impossible de récupérer le produit, id incorrect");
        }
        
        if (product[0].quantity < item.quantity) {
          throw new Error("Quantité de produit insuffisante en stock");
        }
      }

      // Gestion de la quantité de produit en stock
      for (const item of items) {
        await tx.update(products)
          .set({
            quantity: sql`${products.quantity} - ${item.quantity}`
          })
          .where(eq(products.id, item.productId));
      }

      return {
        ...newSale,
        items: saleItemsResult
      };
    });
  },
  
  async getAll(filters: SaleFilters = {}) {
    let query = db.select()
    .from(sales)
    .orderBy(desc(sales.date)) as any;
    
    const conditions: SQL[] = [];

    if (!filters.companyId) {
      throw new Error("Impossible de récupérer les commandes sans companyId");
    } else {
      conditions.push(eq(sales.companyId, filters.companyId));
    }
    
    if (filters.status) {
      conditions.push(eq(sales.status, filters.status as 'pending' | 'completed' | 'cancelled' | 'refunded'));
    }
    
    if (filters.startDate) {
      conditions.push(gte(sales.date, new Date(filters.startDate)));
    }
    
    if (filters.endDate) {
      conditions.push(lte(sales.date, new Date(filters.endDate)));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    return await query;
  },
  
  async getById(id: string, companyId: string) {
    const sale = await db.select()
      .from(sales)
      .where(and(eq(sales.id, id), eq(sales.companyId, companyId)))
      .limit(1);
    
    if (sale.length === 0) {
      throw new Error("Impossible de récupérer la commande, id incorrect");
    }
    
    const items = await db.select({
      id: saleItems.id,
      quantity: saleItems.quantity,
      unitPrice: saleItems.unitPrice,
      productId: saleItems.productId,
      productName: products.name,
      productDescription: products.description
    })
    .from(saleItems)
    .leftJoin(products, eq(saleItems.productId, products.id))
    .where(eq(saleItems.saleId, id));
    
    return {
      ...sale[0],
      items
    };
  },

  async verifySaleOwner(saleId: string) {
    try {
      const sale = await db.select({ companyId: sales.companyId })
        .from(sales)
        .where(eq(sales.id, saleId))
        .limit(1);
      
      if (sale.length === 0) {
        throw new Error("Impossible de récupérer la commande, id incorrect");
      }
      
      return sale[0];
    } catch (error) {
      console.error("Erreur dans verifySaleOwner détaillée:", error);
      throw error;
    }
  },
  
  async updateStatus(id: string, companyId: string, status: string) {
    const updated = await db.update(sales)
      .set({
        status: status as 'pending' | 'completed' | 'cancelled' | 'refunded',
        updatedAt: new Date()
      })
      .where(and(eq(sales.id, id), eq(sales.companyId, companyId)))
      .returning();
      
    return updated[0];
  },
  
  async delete(id: string) {
    const items = await db.select()
      .from(saleItems)
      .where(eq(saleItems.saleId, id));
      
    return await db.transaction(async (tx) => {
      for (const item of items) {
        await tx.update(products)
          .set({
            quantity: sql`${products.quantity} + ${item.quantity}`
          })
          .where(eq(products.id, item.productId));
      }

      // await tx.delete(invoices)
      //   .where(eq(invoices.saleId, saleId));
      
      await tx.delete(saleItems)
        .where(eq(saleItems.saleId, id));
        
      await tx.delete(sales)
        .where(eq(sales.id, id));
    });
  }
};