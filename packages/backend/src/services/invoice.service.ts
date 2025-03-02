import { db } from '../config/db';
import { invoices, sales } from '../schemas';
import { eq, desc, SQL, and, gte, lte } from 'drizzle-orm';
import { generateInvoiceNumber } from '../utils/invoice.number.generator.utils';
import { Invoice } from '../entities/invoice.entitie';

export const invoiceService = {
  async createFromSale (saleId: string) {
    return await db.transaction(async (tx) => {
      // Récupérer la vente avec ses éléments
      const sale = await tx.query.sales.findFirst({
        where: eq(sales.id, saleId),
        with: {
          items: {
            with: {
              product: true
            }
          }
        }
      });
      
      if (!sale) {
        throw new Error('Sale not found');
      }
      
      // Vérifier si une facture existe déjà pour cette vente
      const existingInvoice = await tx.query.invoices.findFirst({
        where: eq(invoices.saleId, saleId)
      });
      
      if (existingInvoice) {
        throw new Error('Invoice already exists for this sale');
      }

      const invoiceNumber = await generateInvoiceNumber();

      if (!invoiceNumber) {
        throw new Error('Failed to generate invoice number');
      }

      const [invoice] = await tx.insert(invoices).values({
        invoiceNumber: invoiceNumber,
        totalAmount: sale.price,
        saleId: sale.id,
        companyId: sale.companyId,
        status: 'draft',
        issuedDate: new Date()
      }).returning();
      
      return invoice;
    });
  },
  
  async getById (invoiceId: string) {
    try {
      const invoice = await db.query.invoices.findFirst({
        where: eq(invoices.id, invoiceId),
        with: {
          sale: {
            with: {
              items: {
                with: {
                  product: true
                }
              },
              company: true
            }
          }
        }
      });
      
      return invoice;
    } catch (err) {
      throw new Error("Erreur lors de la récupération de la facture");
    }
  },

  async updateStatus (invoiceId: string, status: 'cancelled' | 'draft' | 'issued' | 'paid' | 'overdue') {
    try {
      const [updatedInvoice] = await db.update(invoices)
        .set({ 
          status,
          updatedAt: new Date()
        })
        .where(eq(invoices.id, invoiceId))
        .returning();
        
      return updatedInvoice;
    } catch (err) {
      throw new Error("Erreur lors de la modification de la facture");
    }
  },
    
  async getAll(filters: any = {}) {
    try {
      let query = db.select()
      .from(invoices)
      .orderBy(desc(invoices.issuedDate)) as any;
      
      const conditions: SQL[] = [];
  
      if (!filters.companyId) {
        throw new Error("Impossible de récupérer les commandes sans companyId");
      }
      
      conditions.push(eq(invoices.companyId, filters.companyId))
      
      if (filters.status) {
        conditions.push(eq(invoices.status, filters.status as 'cancelled' | 'draft' | 'issued' | 'paid' | 'overdue'));
      }
      
      if (filters.startDate) {
        conditions.push(gte(invoices.issuedDate, new Date(filters.startDate)));
      }
      
      if (filters.endDate) {
        conditions.push(lte(invoices.issuedDate, new Date(filters.endDate)));
      }
      
      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }
      
      return await query;
    } catch (err) {
      console.error('Erreur lors de la mise à jour du produit:', {
        error: err instanceof Error ? {
          message: err.message,
          stack: err.stack,
          code: (err as any).code,
          detail: (err as any).detail,
          constraint: (err as any).constraint
        } : err
      });
      
      if (err instanceof Error) {
        throw new Error(`Impossible de récupérer les factures: ${err.message}`);
      } else {
        throw new Error("Impossible de récupérer les factures: erreur inconnue");
      }
    }
  },

  async updateById (id: string, updatedInvoice: Partial<Invoice>) {
    try {
      const result = await db.update(invoices)
        .set(updatedInvoice)
        .where(eq(invoices.id, id))
        .returning({ id: invoices.id })
        .execute();

      return result;
    } catch (err) {
      throw new Error("Erreur lors de la mise à jour la facture");
    }
  },

  async delete (id: string) {
    try {
      const result = await db.update(invoices)
        .set({ status: 'cancelled' })
        .where(eq(invoices.id, id))
        .returning({ id: invoices.id })
        .execute();

      return result;
    } catch (err) {
      throw new Error("Impossible de supprimer la facture");
    }
  },

  async verifyInvoiceOwner (invoiceId: string, companyId: string) {
    const invoice = await db.select({
      companyId: invoices.companyId
    })
      .from(invoices)
      .where(and(eq(invoices.id, invoiceId), eq(invoices.companyId, companyId)))
      .limit(1);
    
    if (invoice.length === 0) {
      throw new Error("Impossible de récupérer la facture");
    }
    
    if (!invoice[0].companyId) {
      throw new Error("Impossible de récupérer l'id de la company")
    }
    
    return {
      ...invoice[0],
    };
  }
};