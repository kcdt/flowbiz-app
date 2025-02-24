import { z } from 'zod';

export const ProductSchema = z.object({
  name: z.string()
    .max(255, { message: "Le nom ne doit pas dépasser 255 caractères" }),
  description: z.string()
    .max(1000, { message: "La description ne doit pas dépasser 1000 caractères" })
    .optional(),
  price: z.number()
    .positive({ message: "Le prix doit être un nombre positif" }),
  quantity: z.number()
    .int({ message: "La quantité doit être un entier" })
    .positive({ message: "La quantité doit être un nombre positif" })
    .default(1),
  status: z.enum(['available', 'unavailable'], { 
    errorMap: (issue, _ctx) => ({
      message: `Le statut doit être 'available' ou 'unavailable', '${_ctx.data}' n'est pas valide`
    })
  }).default('available'),
  imageUrl: z.string()
    .max(255, { message: "L'URL de l'image ne doit pas dépasser 255 caractères" })
    .url({ message: "L'URL de l'image doit être une URL valide" })
    .optional(),
  userId: z.number()
    .int({ message: "L'ID utilisateur doit être un entier" })
    .positive({ message: "L'ID utilisateur doit être un nombre positif" })
    .optional(),
});

export type ProductInput = z.infer<typeof ProductSchema>;