import { db } from '../config/db';
import { invoices } from '../schemas';
import { eq, desc, SQL, and, gte, lte } from 'drizzle-orm';
import { generateInvoiceNumber } from '../utils/invoice.number.generator.utils';

export const invoiceService = {
  async create (saleId: string, totalAmount: string, companyId: string) {
    const invoiceNumber = await generateInvoiceNumber();
    
    const [newInvoice] = await db.insert(invoices).values({
      invoiceNumber,
      saleId,
      totalAmount,
      status: 'draft',
      companyId: companyId
    }).returning();
    
    return newInvoice;
  },
  
  async getById (id: string) {
    return await db.query.invoices.findFirst({
      where: eq(invoices.id, id),
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
  },

    async updateInvoiceStatus (invoiceId: string, status: 'cancelled' | 'draft' | 'issued' | 'paid' | 'overdue') {
      const [updatedInvoice] = await db.update(invoices)
        .set({ 
          status,
          updatedAt: new Date()
        })
        .where(eq(invoices.id, invoiceId))
        .returning();
        
      return updatedInvoice;
    },
    
    async getInvoiceWithDetails (invoiceId: string) {
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
    },
    
    async getAll(filters: any = {}) {
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
    },
};

// Autres méthodes comme updateStatus, listInvoices, etc.