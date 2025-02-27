import { Request, Response } from 'express';
import APIResponse from '../utils/response.utils';
import { userModel } from '../models/user.model';

export const userController = {
  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await userModel.getById(id);
      if (!user) {
        throw new Error("User not found");
      }

      return APIResponse(res, user, "User found", 201);
    } catch (error: any) {
      return APIResponse(res, null, error.message, 400);
    }
  },

  async update (req: Request, res: Response) {
    try {
      const { id } = req.params;

      const existingUser = await userModel.getById(id);
      if (!existingUser) {
        throw new Error("User not found");
      }

      const updatedUser = await userModel.updateById(id, req.body);
      return APIResponse(res, updatedUser, "User updated");
    } catch (error: any) {
      return APIResponse(res, null, error.message, 500);
    }
  },

  async delete (request: Request, response: Response) {
    try {
      const { id } = request.params;

      const existingUser = await userModel.getById(id);
      if (!existingUser) {
        throw new Error("User not found");
      }

      const deletedUser = await userModel.deleteById(id);
      return APIResponse(response, deletedUser, "User deleted");
    } catch (error: any) {
      return APIResponse(response, null, error.message, 500);
    }
  },
};