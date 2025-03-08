import { db } from '../config/db';
import { sales, saleItems, products, invoices } from '../schemas';
import { eq, and, gte, lte, desc, SQL, sql } from 'drizzle-orm';
import { CreateSaleInput, SaleFilters } from '../types/sale.types';
import { updateSaleItems } from '../services/sale.item.service';

export const saleModel = {
  async createWithItems (saleData: any, items: any[]) {
    return await db.transaction(async (tx) => {
      const [newSale] = await tx.insert(sales)
        .values(saleData)
        .returning();
      
      const saleItemsData = items.map(item => ({
        saleId: newSale.id,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice
      }));
      
      const newItems = await tx.insert(saleItems)
        .values(saleItemsData)
        .returning();
      
      for (const item of items) {
        await tx.update(products)
          .set({
            quantity: sql`${products.quantity} - ${item.quantity}`,
            updatedAt: new Date()
          })
          .where(eq(products.id, item.productId));
      }
      
      return {
        ...newSale,
        items: newItems
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
      conditions.push(gte(sales.date, new Date(filters.startDate).toISOString()));
    }
    
    if (filters.endDate) {
      conditions.push(lte(sales.date, new Date(filters.endDate).toISOString()));
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

  async updateById(id: string, updatedSale: Partial<CreateSaleInput>) {
    try {
      console.log(`Tentative de mise à jour de la vente avec ID: ${id}`, updatedSale);
      
      const currentSale = await db.select()
        .from(sales)
        .where(eq(sales.id, id))
        .limit(1);
      
      if (currentSale.length === 0) {
        throw new Error(`Vente avec l'ID ${id} non trouvée`);
      }
  
      const { items, ...saleUpdateData } = updatedSale;
      
      const changedFields: Record<string, any> = {};
      
      Object.keys(saleUpdateData).forEach(key => {
        const value = saleUpdateData[key as keyof typeof saleUpdateData];
        
        if (key === 'date' && value) {
          if (typeof value === 'string') {
            const currentDate = currentSale[0].date;
            if (currentDate !== value) {
              changedFields[key] = value;
            }
          }
        } 
        else if (value !== undefined && value !== null && value !== currentSale[0][key as keyof typeof currentSale[0]]) {
          changedFields[key] = value;
        }
      });
      
      if (Object.keys(changedFields).length === 0) {
        console.log('Aucun changement détecté, mise à jour non nécessaire');
        return [{ id: currentSale[0].id }];
      }
      
      if (changedFields.price !== undefined) {
        changedFields.price = changedFields.price.toString();
      }
      
      console.log('Champs modifiés à mettre à jour:', changedFields);
      
      const result = await db.update(sales)
        .set(changedFields)
        .where(eq(sales.id, id))
        .returning({ id: sales.id })
        .execute();
  
      if (items && items.length > 0) {
        await updateSaleItems(id, items);
      }
      
      return result;
    } catch (err) {
      console.error('Erreur lors de la mise à jour de la vente:', {
        saleId: id,
        updateData: updatedSale,
        error: err instanceof Error ? {
          name: err.name,
          message: err.message,
          stack: err.stack
        } : err
      });
      
      if (err instanceof Error) {
        throw new Error(`Impossible de mettre à jour la vente: ${err.message}`);
      } else {
        throw new Error("Impossible de mettre à jour la vente: erreur inconnue");
      }
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

      await tx.delete(invoices)
        .where(eq(invoices.saleId, id));
      
      await tx.delete(saleItems)
        .where(eq(saleItems.saleId, id));
        
      await tx.delete(sales)
        .where(eq(sales.id, id));
    });
  }
};