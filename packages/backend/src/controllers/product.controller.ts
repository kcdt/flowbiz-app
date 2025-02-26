import { Request, Response } from 'express';
import APIResponse from '../utils/response.utils';
import { productModel } from '../models/product.model';
import { AuthRequest } from '../types/auth.types';

export const productController = {
  async getAll(req: Request, res: Response) {
    try {
      const allProduct = await productModel.getAll();
      APIResponse(res, allProduct, "Products fetched", 200);
    } catch (error: any) {
      APIResponse(res, null, error.message, 500);
    }
  },

  async create(req: Request, res: Response) {
    try {
      const authReq = req as AuthRequest;
      if (!authReq.user) {
        throw new Error("User not authenticated");
      }
      const userId = authReq.user.id;
      const { name, description, quantity, imageUrl, price, status } = req.body;
      const newProduct = { name, description, quantity, imageUrl, price, status, userId };
      if (!quantity) {
        newProduct.quantity = 1;
      }

      const createdProduct = await productModel.create(newProduct);
      APIResponse(res, { id: createdProduct[0].id, ...newProduct }, "Product created", 201);
    } catch (error: any) {
      APIResponse(res, null, error.message, 400);
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const product = await productModel.getById(id);
      if (!product) {
        throw new Error("Product not found");
      } else {
        APIResponse(res, product, "Product fetch", 200);
      }
    } catch (error: any) {
      APIResponse(res, null, error.message, 404);
    }
  },

  async update (req: Request, res: Response) {
    try {
      const { id } = req.params;
      await productModel.existingProduct(id);
      const updatedProduct = await productModel.updateById(id, req.body);
      APIResponse(res, updatedProduct, "Product updated");
    } catch (error: any) {
      APIResponse(res, null, error.message, 500);
    }
  },

  async delete (request: Request, response: Response) {
    try {
      const { id } = request.params;
      await productModel.existingProduct(id);
      const deletedProduct = await productModel.deleteById(id);
      APIResponse(response, deletedProduct, "Product deleted");
    } catch (error: any) {
      APIResponse(response, null, error.message, 500);
    }
  },
};