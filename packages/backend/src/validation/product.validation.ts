import { z } from 'zod';

export const ProductSchema = z.object({
  name: z.string()
    .max(255, { message: "Le nom ne doit pas dépasser 255 caractères" })
    .nonempty({ message: "Le nom est requis" }),
  description: z.string()
    .max(1000, { message: "La description ne doit pas dépasser 1000 caractères" })
    .nonempty({ message: "La description est requise" }),
  price: z.coerce.number()
    .positive({ message: "Le prix doit être un nombre positif" }),
  quantity: z.coerce.number()
    .int({ message: "La quantité doit être un entier" })
    .nonnegative({ message: "La quantité doit être un nombre positif ou zéro" })
    .default(0),
  imageUrl: z.string()
    .max(255, { message: "L'URL de l'image ne doit pas dépasser 255 caractères" })
    .url({ message: "L'URL de l'image doit être une URL valide" })
    .optional(),
  categoryId: z.string()
    .uuid({ message: "L'ID de catégorie doit être un UUID valide" })
    .optional(),
  companyId: z.string()
    .uuid({ message: "L'ID de l'entreprise doit être un UUID valide" })
});

export const NewProductSchema = z.object({
  name: z.string()
    .max(255, { message: "Le nom ne doit pas dépasser 255 caractères" })
    .nonempty({ message: "Le nom est requis" }),
  description: z.string()
    .max(1000, { message: "La description ne doit pas dépasser 1000 caractères" })
    .nonempty({ message: "La description est requise" }),
  price: z.coerce.number()
    .positive({ message: "Le prix doit être un nombre positif" }),
  quantity: z.coerce.number()
    .int({ message: "La quantité doit être un entier" })
    .nonnegative({ message: "La quantité doit être un nombre positif ou zéro" })
    .default(0),
  imageUrl: z.string()
    .max(255, { message: "L'URL de l'image ne doit pas dépasser 255 caractères" })
    .url({ message: "L'URL de l'image doit être une URL valide" })
    .optional(),
  categoryId: z.string()
    .uuid({ message: "L'ID de catégorie doit être un UUID valide" })
    .optional()
});

export const EditProductSchema = z.object({
  name: z.string()
    .max(255, { message: "Le nom ne doit pas dépasser 255 caractères" })
    .optional(),
  description: z.string()
    .max(1000, { message: "La description ne doit pas dépasser 1000 caractères" })
    .optional(),
  price: z.coerce.number()
    .positive({ message: "Le prix doit être un nombre positif" })
    .optional(),
  quantity: z.coerce.number()
    .int({ message: "La quantité doit être un entier" })
    .nonnegative({ message: "La quantité doit être un nombre positif ou zéro" })
    .optional(),
  imageUrl: z.string()
    .max(255, { message: "L'URL de l'image ne doit pas dépasser 255 caractères" })
    .url({ message: "L'URL de l'image doit être une URL valide" })
    .optional(),
  categoryId: z.string()
    .uuid({ message: "L'ID de catégorie doit être un UUID valide" })
    .optional(),
});

export type ProductInput = z.infer<typeof ProductSchema>;
export type NewProductInput = z.infer<typeof NewProductSchema>;
export type EditProductInput = z.infer<typeof EditProductSchema>;