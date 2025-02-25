import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    role?: string;
  };
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        message: "Accès refusé. Token manquant." 
      });
    }

    const token = authHeader.split(' ')[1];
    
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as {
        id: number;
        email: string;
        role?: string;
      };
      
      req.user = decoded;
      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return res.status(401).json({ 
          message: "Token expiré. Veuillez vous reconnecter." 
        });
      }
      
      return res.status(401).json({ 
        message: "Token invalide." 
      });
    }
  } catch (error) {
    console.error("Erreur d'authentification:", error);
    return res.status(500).json({ 
      message: "Erreur serveur lors de l'authentification." 
    });
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