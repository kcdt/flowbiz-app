import { Request } from 'express';

export interface User {
  id: string;
  email: string;
  role: string;
  companyId?: string;
  name?: string;
}

export interface AuthRequest extends Request {
  user?: User;
}