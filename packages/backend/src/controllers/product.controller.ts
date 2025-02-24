import { Request, Response } from 'express';
import APIResponse from '../utils/response';
import { productModel } from '../models/product.model';

export const productController = {
  async getAll(req: Request, res: Response) {
    try {
      const allProduct = await productModel.getAll();
      APIResponse(res, allProduct.length, "Product", 201);
    } catch (error: any) {
      APIResponse(res, null, 'test', 500);
    }
  },

  async create(req: Request, res: Response) {
    try {
      const { name, price } = req.body; // Validation à faire
      const newProduct = { name, price };
      await productModel.addProduct(newProduct);
      APIResponse(res, newProduct, "Product created", 201);
    } catch (error: any) {
      APIResponse(res, null, error.message, 400);
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const product = await productModel.getProductById(parseInt(id));
      APIResponse(res, product, "Product", 201);
    } catch (error: any) {
      APIResponse(res, null, error.message, 400);
    }
  },

  async update (req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updatedProduct = await productModel.updateById(parseInt(id), req.body);
      APIResponse(res, updatedProduct, "Product updated");
    } catch (error: any) {
      APIResponse(res, null, error.message, 500);
    }
  },

  async delete (request: Request, response: Response) {
    try {
      const { id } = request.params;
      const deletedProduct = await productModel.deleteById(parseInt(id));
      APIResponse(response, deletedProduct, "Product deleted");
    } catch (error: any) {
      APIResponse(response, null, error.message, 500);
    }
  },
};