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
    .optional(),
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
    .optional(),
});

export const uuidSchema = z
  .string()
  .uuid({ message: "Format d'identifiant invalide" });

export type UserInput = z.infer<typeof createUserSchema>;