import { Request, Response } from 'express';
import APIResponse from '../utils/response.utils';
import { userModel } from '../models/user.model';
import logger from '../utils/logger.utils';

export const userController = {
  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await userModel.getById(id);
      if (!user) {
        return APIResponse(res, null, "Utilisateur non trouvé", 404);
      }

      return APIResponse(res, user, "Utilisateur récupéré", 200);
    } catch (error: any) {
      logger.error(`Erreur lors de la récupération de l'utilisateur`, { error: error.message, stack: error.stack });
      return APIResponse(res, null, "Une erreur interne s'est produite", 500);
    }
  },

  async update (req: Request, res: Response) {
    try {
      const { id } = req.params;

      const existingUser = await userModel.getById(id);
      if (!existingUser) {
        return APIResponse(res, null, "Utilisateur non trouvé", 404);
      }

      const updatedUser = await userModel.updateById(id, req.body);
      return APIResponse(res, updatedUser, "Utilisateur mis à jour", 200);
    } catch (error: any) {
      logger.error(`Erreur lors de la mise à jour de l'utilisateur`, { error: error.message, stack: error.stack });
      return APIResponse(res, null, "Une erreur interne s'est produite", 500);
    }
  },

  async delete (req: Request, res: Response) {
    try {
      const { id } = req.params;

      const existingUser = await userModel.getById(id);
      if (!existingUser) {
        return APIResponse(res, null, "Utilisateur non trouvé", 404);
      }

      const deletedUser = await userModel.deleteById(id);
      return APIResponse(res, deletedUser, "Utilisateur supprimer", 200);
    } catch (error: any) {
      logger.error(`Erreur lors de la mise à jour de l'utilisateur`, { error: error.message, stack: error.stack });
      return APIResponse(res, null, error.message, 500);
    }
  },
};