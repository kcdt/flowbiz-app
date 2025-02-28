import { NextFunction, Request, Response } from "express";
import APIResponse from "../utils/response.utils"
import { ProductSchema } from "../validation/product.validation";

export const validateProductSchema = (request: Request, response: Response, next: NextFunction) => {
  try {
      request.body = ProductSchema.parse(request.body);
      next();
  } catch (err: any) {
      return APIResponse(response, err.errors, "Le formulaire est invalide", 400)
  }
};