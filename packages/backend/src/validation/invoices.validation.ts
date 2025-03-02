import { z } from 'zod';

export const InvoiceStatusSchema = z.enum(['draft', 'issued', 'paid', 'cancelled', 'overdue'], {
  errorMap: () => ({ message: "Le statut doit être l'un des suivants : brouillon, émis, payé, annulé ou en retard" })
});

export const createInvoiceSchema = z.object({
  saleId: z
    .string({ required_error: "L'ID de la vente est requis" })
    .uuid("L'ID de la vente doit être un UUID valide"),
});

export const updateInvoiceStatusSchema = z.object({
  status: InvoiceStatusSchema,
});

export const updateInvoiceSchema = z.object({
  invoiceNumber: z
    .string()
    .min(1, "Le numéro de facture ne peut pas être vide")
    .max(50, "Le numéro de facture ne peut pas dépasser 50 caractères")
    .optional(),
  
  issuedDate: z
    .string()
    .or(z.date())
    .refine((val) => !val || !isNaN(new Date(val).getTime()), {
      message: "La date d'émission doit être une date valide"
    })
    .optional(),
  
  totalAmount: z
    .number()
    .positive("Le montant total doit être positif")
    .multipleOf(0.01, "Le montant total doit avoir au maximum 2 décimales")
    .optional(),
  
  status: InvoiceStatusSchema.optional(),
}).refine(data => Object.keys(data).length > 0, {
  message: "Au moins un champ doit être fourni pour la mise à jour"
});

export const invoiceQuerySchema = z.object({
  status: InvoiceStatusSchema.optional(),
  companyId: z
    .string()
    .uuid("L'ID de l'entreprise doit être un UUID valide")
    .optional(),
  fromDate: z
    .string()
    .refine((val) => !val || !isNaN(new Date(val).getTime()), {
      message: "La date de début doit être une date valide"
    })
    .optional(),
  toDate: z
    .string()
    .refine((val) => !val || !isNaN(new Date(val).getTime()), {
      message: "La date de fin doit être une date valide"
    })
    .optional(),
  page: z
    .string()
    .or(z.number())
    .transform(val => Number(val))
    .refine(val => !isNaN(val) && val > 0, {
      message: "Le numéro de page doit être un nombre positif"
    })
    .optional(),
  limit: z
    .string()
    .or(z.number())
    .transform(val => Number(val))
    .refine(val => !isNaN(val) && val > 0 && val <= 100, {
      message: "La limite doit être un nombre entre 1 et 100"
    })
    .optional()
});