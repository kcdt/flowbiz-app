import { NextFunction, Request, Response } from "express";
import APIResponse from "../utils/response"
import { z } from "zod";

export const validateRequest = <T extends z.ZodTypeAny>(schema: T, req: Request, res: Response, next: NextFunction) => {
  try {
    const data = schema.parse(req.body);
    req.body = data;
    next();
  } catch (err) {
    if (err instanceof z.ZodError) {
      return APIResponse(res, err.errors, "Validation failed", 400);
    }
    
    return APIResponse(res, null, "Internal server error during validation", 500);
  }
}

// Exemple d'utilisation dans une route
// app.post('/users', (req, res, next) => validateRequest(createUserSchema, req, res, next), createUserHandler);
// app.put('/users/:id', (req, res, next) => validateRequest(updateUserSchema, req, res, next), updateUserHandler);