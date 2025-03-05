import { z } from "zod";

const userRoleSchema = z.enum(["admin_seller", "standard_seller", "supplier"]).default("admin_seller");

export const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string()
});

export const createUserSchema = z.object({
  email: z
    .string()
    .email({ message: "Format d'email invalide" })
    .max(255, { message: "L'email ne peut pas dépasser 255 caractères" }),
  name: z
    .string()
    .min(2, { message: "Le nom doit contenir au moins 2 caractères" })
    .max(255, { message: "Le nom ne peut pas dépasser 255 caractères" }),
  role: userRoleSchema,
  phone: z
    .string()
    .regex(/^(\+\d{1,3})?[\s.-]?\(?\d{1,4}\)?[\s.-]?\d{1,4}[\s.-]?\d{1,9}$/, {
      message: "Numéro de téléphone invalide"
    })
    .max(20, { message: "Le numéro de téléphone ne peut pas dépasser 20 caractères" })
    .optional(),
  password: z
    .string()
    .min(8, { message: "Le mot de passe doit contenir au moins 8 caractères" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
      message: "Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial"
    }),
  companyId: z
    .string()
    .uuid({ message: "Format d'identifiant de société invalide" })
});

export const updateUserSchema = z.object({
  email: z
    .string()
    .email({ message: "Format d'email invalide" })
    .max(255, { message: "L'email ne peut pas dépasser 255 caractères" })
    .optional(),
  name: z
    .string()
    .min(2, { message: "Le nom doit contenir au moins 2 caractères" })
    .max(255, { message: "Le nom ne peut pas dépasser 255 caractères" })
    .optional(),
  role: userRoleSchema,
  phone: z
    .string()
    .regex(/^(\+\d{1,3})?[\s.-]?\(?\d{1,4}\)?[\s.-]?\d{1,4}[\s.-]?\d{1,9}$/, {
      message: "Numéro de téléphone invalide"
    })
    .max(20, { message: "Le numéro de téléphone ne peut pas dépasser 20 caractères" })
    .optional(),
  password: z
    .string()
    .min(8, { message: "Le mot de passe doit contenir au moins 8 caractères" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
      message: "Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial"
    })
    .optional(),
  companyId: z
    .string()
    .uuid({ message: "Format d'identifiant de société invalide" })
});


export const registerSchema = z.object({
  userName: z
    .string()
    .min(1, "Le nom de l'utilisateur est requis")
    .max(255, "Le nom ne peut pas dépasser 255 caractères"),
  
  userEmail: z
    .string()
    .email("Format d'email invalide")
    .max(255, "L'email ne peut pas dépasser 255 caractères"),
  
  userPhone: z
    .string()
    .min(1, "Le numéro de téléphone est requis")
    .max(20, "Le numéro de téléphone ne peut pas dépasser 20 caractères")
    .regex(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,9}$/, "Format de téléphone invalide"),
  
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une lettre majuscule")
    .regex(/[a-z]/, "Le mot de passe doit contenir au moins une lettre minuscule")
    .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre")
    .regex(/[^A-Za-z0-9]/, "Le mot de passe doit contenir au moins un caractère spécial"),
  
  role: z
    .enum(["admin_seller", "standard_seller", "supplier"], {
      errorMap: () => ({ message: "Le rôle doit être 'admin_seller', 'standard_seller' ou 'supplier'" })
    }),
  
  companyName: z
    .string()
    .min(1, "Le nom de l'entreprise est requis")
    .max(255, "Le nom de l'entreprise ne peut pas dépasser 255 caractères"),
  
  companyAddress: z
    .string()
    .min(1, "L'adresse de l'entreprise est requise")
    .max(500, "L'adresse ne peut pas dépasser 500 caractères"),
  
  companyPhone: z
    .string()
    .min(1, "Le numéro de téléphone de l'entreprise est requis")
    .max(20, "Le numéro de téléphone ne peut pas dépasser 20 caractères")
    .regex(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,9}$/, "Format de téléphone invalide"),
  
  companyEmail: z
    .string()
    .email("Format d'email d'entreprise invalide")
    .max(255, "L'email d'entreprise ne peut pas dépasser 255 caractères"),
  
  taxId: z
    .string()
    .max(50, "Le numéro SIRET ne peut pas dépasser 50 caractères")
    .optional()
    .or(z.literal(''))
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const uuidSchema = z
  .string()
  .uuid({ message: "Format d'identifiant invalide" });

export type UserInput = z.infer<typeof createUserSchema>;