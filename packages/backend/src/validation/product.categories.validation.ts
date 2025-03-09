import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string()
    .min(1, "Le nom de la catégorie est requis")
    .max(100, "Le nom ne peut pas dépasser 100 caractères"),
  description: z.string()
    .max(500, "La description ne peut pas dépasser 500 caractères")
    .optional(),
});

export const updateCategorySchema = createCategorySchema.partial()
  .refine(data => Object.keys(data).length > 0, {
    message: "Au moins un champ doit être fourni pour la mise à jour"
  });

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;