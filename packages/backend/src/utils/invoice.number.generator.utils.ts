import { db } from '../config/db';
import { invoices } from '../schemas';
import { sql } from 'drizzle-orm';

export const generateInvoiceNumber = async () => {
  // Récupérer le dernier numéro de facture de l'année en cours
  const currentYear = new Date().getFullYear();
  const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, '0');
  const prefix = `INV-${currentYear}-${currentMonth}-`;
  
  const result = await db.select({
    maxNumber: sql`MAX(CAST(SUBSTRING(invoice_number FROM LENGTH(${prefix}) + 1) AS INTEGER))`
  })
  .from(invoices)
  .where(sql`invoice_number LIKE ${prefix + '%'}`);

  const lastNumber = Number(result[0]?.maxNumber) || 0;
  const nextNumber = lastNumber + 1;
  
  // Formater avec des zéros de remplissage (ex: 001, 012, 123)
  return `${prefix}${nextNumber.toString().padStart(3, '0')}`;
};