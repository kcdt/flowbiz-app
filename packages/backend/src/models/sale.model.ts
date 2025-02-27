import { db } from '../config/db';
import { sales, saleItems, products, users } from '../schemas';
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
        companyId: saleData.companyId,
        userId: saleData.userId
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

    if (!filters.companyId && !filters.userId) {
      throw new Error("Impossible de récupérer les commandes sans companyId ou userId");
    } else {
      if (filters.companyId) {
        conditions.push(eq(sales.companyId, filters.companyId));
      } else if (filters.userId) {
        conditions.push(eq(sales.userId, filters.userId));
      }
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
  
  async getById(id: string) {
    const sale = await db.select()
      .from(sales)
      .where(eq(sales.id, id))
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

    if (!sale[0].companyId && !sale[0].userId) {
      throw new Error("Impossible de récupérer l'id de la company ou de l'utilisateur")
    }
    
    let seller: {        
      id: string,
      name: string,
      email: string,
      companyId: string | null
    } | null = null

    if (sale[0].userId) {
      const sellerResult = await db.select({
        id: users.id,
        name: users.name,
        email: users.email,
        companyId: users.companyId
      })
      .from(users)
      .where(eq(users.id, sale[0].userId))
      .limit(1);
      
      if (sellerResult.length > 0) {
        seller = sellerResult[0];
      }
    } 
    else if (!seller && sale[0].companyId) {
      const companyUsers = await db.select({
        id: users.id,
        name: users.name,
        email: users.email,
        companyId: users.companyId
      })
      .from(users)
      .where(eq(users.companyId, sale[0].companyId))
      .limit(1);
      
      if (companyUsers.length > 0) {
        seller = companyUsers[0];
      }
    }
    
    return {
      ...sale[0],
      items,
      seller: seller
    };
  },

  async getOwnerById (id: string) {
    const sale = await db.select({
      userId: sales.userId,
      companyId: sales.companyId
    })
      .from(sales)
      .where(eq(sales.id, id))
      .limit(1);
    
    if (sale.length === 0) {
      throw new Error("Impossible de récupérer la commande, id incorrect");
    }
    
    if (!sale[0].companyId && !sale[0].userId) {
      throw new Error("Impossible de récupérer l'id de la company ou de l'utilisateur")
    }
    
    return {
      ...sale[0],
    };
  },
  
  async updateStatus(id: string, status: string) {
    const updated = await db.update(sales)
      .set({
        status: status as 'pending' | 'completed' | 'cancelled' | 'refunded',
        updatedAt: new Date()
      })
      .where(eq(sales.id, id))
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
      
      await tx.delete(saleItems)
        .where(eq(saleItems.saleId, id));
        
      await tx.delete(sales)
        .where(eq(sales.id, id));
    });
  }
};