import { z } from 'zod';

export const createCompanySchema = z.object({
  name: z.string()
    .min(1, "Le nom de l'entreprise est requis")
    .max(255, "Le nom de l'entreprise ne peut pas dépasser 255 caractères"),
  
  address: z.string()
    .min(1, "L'adresse est requise")
    .max(500, "L'adresse ne peut pas dépasser 500 caractères"),
  
  phone: z.string()
    .min(1, "Le numéro de téléphone est requis")
    .max(20, "Le numéro de téléphone ne peut pas dépasser 20 caractères")
    .regex(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,9}$/, "Format de téléphone invalide"),
  
  email: z.string()
    .min(1, "L'email est requis")
    .max(255, "L'email ne peut pas dépasser 255 caractères")
    .email("Format d'email invalide"),
  
  taxId: z.string()
    .max(50, "Le numéro SIRET ne peut pas dépasser 50 caractères")
    .optional(),
});

export const updateCompanySchema = z.object({
  name: z.string()
    .max(255, "Le nom de l'entreprise ne peut pas dépasser 255 caractères")
    .optional(),
  
  address: z.string()
    .max(500, "L'adresse ne peut pas dépasser 500 caractères")
    .optional(),
  
  phone: z.string()
    .max(20, "Le numéro de téléphone ne peut pas dépasser 20 caractères")
    .regex(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,9}$/, "Format de téléphone invalide")
    .optional(),
  
  email: z.string()
    .max(255, "L'email ne peut pas dépasser 255 caractères")
    .email("Format d'email invalide")
    .optional(),
  
  taxId: z.string()
    .max(50, "Le numéro SIRET ne peut pas dépasser 50 caractères")
    .optional(),
}).refine(data => Object.keys(data).length > 0, {
  message: "Au moins un champ doit être fourni pour la mise à jour"
});

export type CreateCompanyInput = z.infer<typeof createCompanySchema>;

export type UpdateCompanyInput = z.infer<typeof updateCompanySchema>;