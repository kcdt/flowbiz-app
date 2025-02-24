import { Request, Response } from 'express';
import APIResponse from '../utils/response';
import { userModel } from '../models/user.model';

export const userController = {
  async create(req: Request, res: Response) {
    try {
      const { name, email, status, phone, passwordHash } = req.body;
      const newUser = { name, email, status, phone, passwordHash };

      const createdUser = await userModel.createUser(newUser);
      APIResponse(res, { id: createdUser[0].id, ...newUser }, "User created", 201);
    } catch (error: any) {
      APIResponse(res, null, error.message, 400);
    }
  },

  async getByName(req: Request, res: Response) {
    try {
      const user = await userModel.getByName(req.body.name);
      APIResponse(res, user, "User found", 201);
    } catch (error: any) {
      APIResponse(res, null, error.message, 500);
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await userModel.getUserById(id);
      if (!user) {
        throw new Error("User not found");
      } else {
        APIResponse(res, user, "User found", 201);
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