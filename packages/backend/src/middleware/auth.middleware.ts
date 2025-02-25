import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import APIResponse from "../utils/response.utils";
import { AuthRequest } from "../types/auth.types";

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return APIResponse(res, null, "Accès refusé. Token manquant", 401);
    }

    const token = authHeader.split(' ')[1];
    
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as {
        id: string;
        email: string;
        role: string;
        companyId: string;
      };
      
      (req as AuthRequest).user = decoded;
      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return APIResponse(res, null, "Token expiré. Veuillez vous reconnecter", 401);
      }
      
      return APIResponse(res, null, "Token invalide", 401);
    }
  } catch (error) {
    console.error("Erreur d'authentification:", error);
    return APIResponse(res, null, "Erreur serveur lors de l'authentification", 500);
  }
};

export const isCurrentUser = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    const { id } = req.params;
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return APIResponse(res, null, "Accès refusé. Token manquant", 401);
    }

    const token = authHeader.split(' ')[1];
    
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as {
        id: string;
        email: string;
        role: string;
        companyId: string;
      };
      
      (req as AuthRequest).user = decoded;

      if (id !== decoded.id) {
        return APIResponse(res, null, "Vous n'êtes pas autorisé à accéder à cet utilisateur", 401);
      }
      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return APIResponse(res, null, "Token expiré. Veuillez vous reconnecter", 401);
      }
      
      return APIResponse(res, null, "Token invalide", 401);
    }
  } catch (error) {
    console.error("Erreur d'authentification:", error);
    return APIResponse(res, null, "Erreur serveur lors de l'authentification", 500);
  }
};

// Middleware pour vérifier les permissions selon le rôle
export const roleMiddleware = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ 
        message: "Utilisateur non authentifié." 
      });
    }

    if (!req.user.role || !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: "Accès interdit. Vous n'avez pas les permissions nécessaires." 
      });
    }

    next();
  };
};

// export const ownerMiddleware = (resourceIdParam: string) => {
//   return async (req: AuthRequest, res: Response, next: NextFunction) => {
//     try {
//       if (!req.user) {
//         return res.status(401).json({ 
//           message: "Utilisateur non authentifié." 
//         });
//       }

//       const resourceId = req.params[resourceIdParam];
      
//       if (!resourceId) {
//         return res.status(400).json({ 
//           message: "ID de ressource manquant." 
//         });
//       }

//       // Vérifier que l'utilisateur est propriétaire de la ressource
//       // Note: Cet exemple suppose une ressource générique, à adapter selon votre modèle
//       const resource = await db.query.yourResourceTable.findFirst({
//         where: eq(yourResourceTable.id, parseInt(resourceId))
//       });

//       if (!resource) {
//         return res.status(404).json({ 
//           message: "Ressource non trouvée." 
//         });
//       }

//       if (resource.userId !== req.user.id) {
//         return res.status(403).json({ 
//           message: "Accès interdit. Vous n'êtes pas le propriétaire de cette ressource." 
//         });
//       }

//       next();
//     } catch (error) {
//       console.error("Erreur de vérification de propriété:", error);
//       return res.status(500).json({ 
//         message: "Erreur serveur lors de la vérification de propriété." 
//       });
//     }
//   };
// };