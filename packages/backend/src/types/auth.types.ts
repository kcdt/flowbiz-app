import { Request } from 'express';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    companyId: string;
  };
}

export interface VerifiedAuthRequest extends AuthRequest {
  user: {
    id: string;
    email: string;
    role: string;
    companyId: string;
  };
}