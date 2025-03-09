import { Request, Response } from 'express';
import { invoiceService } from '../services/invoice.service';
import { generatePDF } from '../utils/pdf.generator.utils';
import APIResponse from '../utils/response.utils';
import { VerifiedAuthRequest } from '../types/auth.types';
import logger from '../utils/logger.utils';

export const invoicesController = {
  async create (req: Request, res: Response) {
    try {
      const { saleId } = req.body;
      
      if (!saleId) {
        return APIResponse(res, null, `Sale ID n'est pas défini`, 400);
      }
      
      const invoice = await invoiceService.createFromSale(saleId);
      return APIResponse(res, invoice, "Facture créée avec succès", 201);
    } catch (error: any) {
      logger.error(`Erreur lors de la création de la vente`, { error: error.message, stack: error.stack });
      return APIResponse(res, null, "Une erreur interne s'est produite", 500);
    }
  },
  
  async getById (req: Request, res: Response) {
    try {
      const { id } = req.params;
      const invoice = await invoiceService.getById(id);
      
      if (!invoice) {
        return APIResponse(res, null, `Facture non trouvée`, 404);
      }
      
      return APIResponse(res, invoice, "Facture récupérée avec succès", 200);
    } catch (error: any) {
      logger.error(`Erreur lors de la récupération de la facture`, { error: error.message, stack: error.stack });
      return APIResponse(res, null, "Une erreur interne s'est produite", 500);
    }
  },
  
  async updateStatus (req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      if (!status || !['draft', 'issued', 'paid', 'cancelled', 'overdue'].includes(status)) {
        return APIResponse(res, null, `Un statut valide est requis`, 400);
      }
      
      const invoice = await invoiceService.updateStatus(id, status);
      return APIResponse(res, invoice, "Facture mise à jour avec succès", 200);
    } catch (error: any) {
      logger.error(`Erreur lors de la récupération de la mise à jour de la facture`, { error: error.message, stack: error.stack });
      return APIResponse(res, null, "Une erreur interne s'est produite", 500);
    }
  },
  
  async generatePDF (req: Request, res: Response) {
    try {
      const { id } = req.params;
      const invoice = await invoiceService.getById(id);
      
      if (!invoice) {
        return APIResponse(res, null, `Facture non trouvée`, 404);
      }
      
      if (!invoice.status || !invoice.sale.status) {
        return APIResponse(res, null, `Le statut de la facture est invalide`, 400);
      }

      invoice.sale.items = invoice.sale.items.map(item => ({
        ...item,
        unitPrice: parseFloat(item.unitPrice).toString(),
        product: item.product
      }));
      
      const pdfPath = await generatePDF(invoice);
      
      return APIResponse(res, pdfPath, "PDF généré avec succès", 201);
    } catch (error: any) {
      logger.error(`Erreur lors de la génération du PDF`, { error: error.message, stack: error.stack });
      return APIResponse(res, null, "Une erreur interne s'est produite", 500);
    }
  },
  
  async getAll (req: Request, res: Response) {
    try {
      const authReq = req as VerifiedAuthRequest;
      const filters = req.query;
      filters.companyId = authReq.user.companyId;
      const invoices = await invoiceService.getAll(filters);
      return APIResponse(res, invoices, "Factures récupérées avec succès", 200);
    } catch (error: any) {
      logger.error(`Erreur lors de la récupération des factures`, { error: error.message, stack: error.stack });
      return APIResponse(res, null, "Une erreur interne s'est produite", 500);
    }
  },

  async delete (req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const invoice = await invoiceService.delete(id);
      return APIResponse(res, invoice, "Facture supprimée avec succès", 200);
    } catch (error: any) {
      logger.error(`Erreur lors de la supression de la facture`, { error: error.message, stack: error.stack });
      return APIResponse(res, null, "Une erreur interne s'est produite", 500);
    }
  }
}