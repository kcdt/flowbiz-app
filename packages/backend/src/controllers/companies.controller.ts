import { Request, Response } from 'express';
import APIResponse from '../utils/response.utils';
import { companiesModel } from '../models/companies.model';
import logger from '../utils/logger.utils';

export const companyController = {
  async update (req: Request, res: Response) {
    try {
      const { id } = req.params;

      await companiesModel.getById(id);
      const updatedCompany = await companiesModel.updateById(id, req.body);
      return APIResponse(res, updatedCompany, "Entreprise mise à jour", 200);
    } catch (error: any) {
      logger.error(`Erreur lors de la mise à jour de l'entreprise`, { error: error.message, stack: error.stack });
      return APIResponse(res, null, "Une erreur interne s'est produite", 500);    }
  },

  async getById (req: Request, res: Response) {
    try {
      const { id } = req.params;

      const company = await companiesModel.getById(id);
      return APIResponse(res, company, "Entreprise récupérée", 200);
    } catch (error: any) {
      logger.error(`Erreur lors de la récupération de l'entreprise`, { error: error.message, stack: error.stack });
      return APIResponse(res, null, "Une erreur interne s'est produite", 500);
    }
  }
};