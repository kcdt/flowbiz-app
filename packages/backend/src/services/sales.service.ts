import { productModel } from '../models/product.model';
import { saleModel } from '../models/sale.model';
import { CreateSaleInput, SaleItemInput, UpdateSaleInput, updateSaleItemsInput } from '../types/sale.types';
import { updateSaleItems } from './sale.item.service';

export const salesService = {
  async createWithItems (companyId: string, saleInput: CreateSaleInput) {
    const productIds = saleInput.items.map(item => item.productId);
    const products = await productModel.getProductsByIds(productIds, companyId);
    
    if (products.length !== productIds.length) {
      throw new Error("Un ou plusieurs produits n'existent pas ou n'appartiennent pas à votre entreprise");
    }
    
    const productMap = products.reduce((acc, product) => {
      acc[product.id] = product;
      return acc;
    }, {} as Record<string, any>);
    
    let totalPrice = 0;
    const validatedItems = [];
    
    for (const item of saleInput.items) {
      const product = productMap[item.productId];
      
      if (product.quantity < item.quantity) {
        throw new Error(`Stock insuffisant pour le produit "${product.name}". Disponible: ${product.quantity}`);
      }

      const productData = await productModel.getPrice(item.productId);
      
      if (!productData || productData.price === undefined) {
        throw new Error(`Le prix du produit avec l'ID "${item.productId}" est introuvable.`);
      }
      
      const itemTotal = parseFloat(productData.price) * item.quantity;
      totalPrice += itemTotal;
      
      validatedItems.push({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: productData.price
      });
    }
    
    const saleData = {
      price: totalPrice.toFixed(2),
      buyerName: saleInput.buyerName,
      buyerAddress: saleInput.buyerAddress,
      companyId
    };
    
    return await saleModel.createWithItems(saleData, validatedItems);
  },

  async updateWithItems(saleId: string, companyId: string, updateData: UpdateSaleInput) {
    const existingSale = await saleModel.getById(saleId, companyId);
    
    if (!existingSale) {
      throw new Error("Vente non trouvée");
    }
    
    if (existingSale.companyId !== companyId) {
      throw new Error("Vous n'êtes pas autorisé à modifier cette vente");
    }
    
    let updatedPrice = existingSale.price;
    const preparedItems: SaleItemInput[] = [];
    
    if (updateData.items && updateData.items.length > 0) {
      const existingItemsMap = existingSale.items.reduce((acc, item) => {
        acc[item.productId] = item;
        return acc;
      }, {} as Record<string, any>);
      
      const allProductIds: string[] = [...new Set([
        ...updateData.items.map((item: updateSaleItemsInput) => item.productId),
        ...existingSale.items.map((item: updateSaleItemsInput) => item.productId)
      ])];
      
      const products = await productModel.getProductsByIds(allProductIds, companyId);
      const productMap = products.reduce((acc, product) => {
        acc[product.id] = product;
        return acc;
      }, {} as Record<string, any>);
      
      let totalPrice = 0;
      const preparedItems: SaleItemInput[] = [];
      
      for (const item of updateData.items) {
        const product = productMap[item.productId];
        
        if (!product) {
          throw new Error(`Le produit avec l'ID "${item.productId}" n'existe pas ou n'appartient pas à votre entreprise`);
        }
        
        const existingItem = existingItemsMap[item.productId];
        const existingQuantity = existingItem ? existingItem.quantity : 0;
        const quantityDifference = item.quantity - existingQuantity;
        
        if (quantityDifference > 0 && product.quantity < quantityDifference) {
          throw new Error(`Stock insuffisant pour le produit "${product.name}". Disponible: ${product.quantity}, Demandé: ${quantityDifference} de plus`);
        }
        
        let itemUnitPrice = item.unitPrice;
        
        if (itemUnitPrice === undefined || itemUnitPrice === null) {
          if (existingItem) {
            itemUnitPrice = existingItem.unitPrice;
          } else {
            const productData = await productModel.getPrice(item.productId);
            if (!productData || productData.price === undefined) {
              throw new Error(`Le prix du produit avec l'ID "${item.productId}" est introuvable.`);
            }
            itemUnitPrice = parseFloat(productData.price);
          }
        }
        
        const numericUnitPrice = typeof itemUnitPrice === 'string' ? parseFloat(itemUnitPrice) : itemUnitPrice;
        if (numericUnitPrice === undefined) {
          throw new Error(`Le prix unitaire pour le produit avec l'ID "${item.productId}" est introuvable.`);
        }
        const itemTotal = numericUnitPrice * item.quantity;
        totalPrice += itemTotal;
        
        preparedItems.push({
          id: existingItem?.id,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: numericUnitPrice
        });
        
        if (quantityDifference !== 0) {
          await productModel.updateStock(item.productId, -quantityDifference);
        }
      }
      
      for (const existingItem of existingSale.items) {
        const isItemStillPresent = updateData.items.some(item => item.productId === existingItem.productId);
        
        if (!isItemStillPresent) {
          await productModel.updateStock(existingItem.productId, existingItem.quantity);
        }
      }
      
      updatedPrice = totalPrice.toFixed(2);
      
      await updateSaleItems(saleId, preparedItems);
    }
    
    const saleUpdateData: Partial<CreateSaleInput> = {
      ...updateData,
      price: updatedPrice,
      date: updateData.date instanceof Date ? updateData.date.toISOString() : updateData.date,
      items: preparedItems.map(item => ({
        id: item.id,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice
      }))
    };
    
    delete saleUpdateData.items;
    
    return await saleModel.updateById(saleId, saleUpdateData);
  }
};
