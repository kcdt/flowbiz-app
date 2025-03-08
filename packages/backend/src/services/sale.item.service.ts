import { db } from "../config/db";
import { eq, inArray } from 'drizzle-orm';
import { saleItems } from "../schemas";
import { SaleItemInput } from "../types/sale.types";

export async function updateSaleItems(saleId: string, items: SaleItemInput[]) {
  const existingItems = await db.select()
    .from(saleItems)
    .where(eq(saleItems.saleId, saleId));
  
  const itemsToAdd = [];
  const itemsToUpdate = [];
  const existingItemIds = new Set(existingItems.map(item => item.id));
  const updatedItemIds = new Set();
    
  for (const item of items) {
    if (item.id && existingItemIds.has(item.id)) {
      updatedItemIds.add(item.id);
      
      const existingItem = existingItems.find(ei => ei.id === item.id);
      
      if(existingItem){
        const needsUpdate = 
          existingItem.quantity !== item.quantity || 
          existingItem.unitPrice !== item.unitPrice.toString() || 
          existingItem.productId !== item.productId;
        
        if (needsUpdate) {
          itemsToUpdate.push({
            id: item.id,
            quantity: item.quantity,
            unitPrice: typeof item.unitPrice === 'number' ? 
              item.unitPrice.toFixed(2) : item.unitPrice,
            productId: item.productId
          });
        }
      }
    } else {
      itemsToAdd.push({
        saleId: saleId,
        quantity: item.quantity,
        unitPrice: typeof item.unitPrice === 'number' ? 
          item.unitPrice.toFixed(2) : item.unitPrice,
        productId: item.productId
      });
    }
  }
  
  const itemsToDelete = existingItems
    .filter(item => !updatedItemIds.has(item.id))
    .map(item => item.id);
  
  if (itemsToAdd.length > 0) {
    await db.insert(saleItems).values(itemsToAdd);
    console.log(`${itemsToAdd.length} nouveaux items ajoutés à la vente`);
  }
  
  for (const item of itemsToUpdate) {
    const { id, ...updateData } = item;
    await db.update(saleItems)
      .set(updateData)
      .where(eq(saleItems.id, id));
  }
  if (itemsToUpdate.length > 0) {
    console.log(`${itemsToUpdate.length} items mis à jour`);
  }
  
  if (itemsToDelete.length > 0) {
    await db.delete(saleItems)
      .where(inArray(saleItems.id, itemsToDelete));
    console.log(`${itemsToDelete.length} items supprimés`);
  }
    
  console.log('Résumé des modifications d\'items:', {
    ajoutés: itemsToAdd.length,
    modifiés: itemsToUpdate.length,
    supprimés: itemsToDelete.length
  });
  
  return {
    ajoutés: itemsToAdd.length,
    modifiés: itemsToUpdate.length,
    supprimés: itemsToDelete.length
  };
}