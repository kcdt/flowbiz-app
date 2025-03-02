import { productModel } from '../models/product.model';
import { saleModel } from '../models/sale.model';
import { CreateSaleInput } from '../types/sale.types';

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
}