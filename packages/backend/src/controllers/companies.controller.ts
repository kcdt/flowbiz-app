import { Request, Response } from 'express';
import APIResponse from '../utils/response.utils';
import { companiesModel } from '../models/companies.model';

export const companyController = {
  async update (req: Request, res: Response) {
    try {
      const { id } = req.params;

      await companiesModel.getById(id);
      const updatedCompany = await companiesModel.updateById(id, req.body);
      return APIResponse(res, updatedCompany, "Produit mis à jour");
    } catch (error: any) {
      return APIResponse(res, null, error.message, 500);
    }
  }
};