import { Request, Response } from 'express';
import APIResponse from '../utils/response';
import { userModel } from '../models/user.model';

export const userController = {
  async create(req: Request, res: Response) {
    try {
      const { name, email, role, phone, passwordHash, companyId } = req.body;
      const newUser = { name, email, role, phone, passwordHash, companyId };

      const createdUser = await userModel.createUser(newUser);
      APIResponse(res, { id: createdUser[0].id, ...newUser }, "User created", 201);
    } catch (error: any) {
      APIResponse(res, null, error.message, 400);
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await userModel.getById(id);
      if (!user) {
        throw new Error("User not found");
      } else {
        APIResponse(res, user, "User found", 201);
      }
    } catch (error: any) {
      APIResponse(res, null, error.message, 400);
    }
  },


  async getUserProducts (req: Request, res: Response) {
    try {
      const { id } = req.params;
      const products = await userModel.getUserProducts(id);
      if (!products) {
        throw new Error("Products not found");
      } else {
        APIResponse(res, products, "Products found", 201);
      }
    } catch (error: any) {
      APIResponse(res, null, error.message, 400);
    }
  },


  async update (req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updatedUser = await userModel.updateById(id, req.body);
      APIResponse(res, updatedUser, "User updated");
    } catch (error: any) {
      APIResponse(res, null, error.message, 500);
    }
  },

  async delete (request: Request, response: Response) {
    try {
      const { id } = request.params;
      const deletedUser = await userModel.deleteById(id);
      APIResponse(response, deletedUser, "User deleted");
    } catch (error: any) {
      APIResponse(response, null, error.message, 500);
    }
  },
};