import { z } from 'zod';
import { saleStatusEnum } from '../schemas/sales.schema';

export const createSaleSchema = z.object({
  buyerName: z.string().min(2, "Le nom de l'acheteur doit contenir au moins 2 caractères"),
  buyerAddress: z.string().min(5, "L'adresse doit contenir au moins 5 caractères"),
  items: z.array(
    z.object({
      quantity: z.number().int().positive("La quantité doit être un nombre entier positif"),
      productId: z.string().uuid("ID de produit invalide")
    })
  ).min(1, "La commande doit contenir au moins un article")
});

export const updateSaleStatusSchema = z.object({
  status: z.enum(saleStatusEnum.enumValues, {
    errorMap: () => ({ message: "Statut invalide" })
  })
});