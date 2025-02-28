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
  imageUrl: z.string()
    .max(255, { message: "L'URL de l'image ne doit pas dépasser 255 caractères" })
    .url({ message: "L'URL de l'image doit être une URL valide" })
    .optional(),
  companyId: z.string().uuid()
    .uuid({ message: "L'ID company doit être un uuid valide" })
});

export const NewProductSchema = z.object({
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
  imageUrl: z.string()
    .max(255, { message: "L'URL de l'image ne doit pas dépasser 255 caractères" })
    .url({ message: "L'URL de l'image doit être une URL valide" })
    .optional()
});

export type ProductInput = z.infer<typeof ProductSchema>;