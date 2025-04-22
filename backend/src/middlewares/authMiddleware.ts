import { PrismaClient } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

// On étend l'interface Request d'Express pour y ajouter notre userId
// Ça permet d'avoir l'autocomplétion et le typage sur req.userId
declare global {
  namespace Express {
    interface Request {
      userId?: string; // L'ID de l'utilisateur extrait du token JWT
    }
  }
}

// Middleware principal qui vérifie si l'utilisateur est authentifié
const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  // Récupère le token depuis les cookies
  const token = req.cookies.authToken;

  // Si pas de token, l'utilisateur n'est pas connecté
  if (!token) {
    res.status(401).json({ success: false, message: 'Authentification requise' });
    return;
  }

  try {
    // Vérifie et décode le token JWT
    // On ne récupère que l'userId car c'est la seule info dont on a besoin
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };

    // Stocke l'userId dans la requête pour les middlewares/routes suivants
    req.userId = decoded.userId;
    next(); // Passe au middleware/route suivant
  } catch (error) {
    // Si le token est invalide ou expiré
    res.status(401).json({ success: false, message: 'Token invalide' });
    return;
  }
};

// Middleware qui vérifie si l'utilisateur a les bons rôles
// Prend en paramètre un tableau des rôles autorisés
const roleMiddleware = (allowedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Vérifie si l'utilisateur est authentifié
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentification requise',
      });
    }

    try {
      // Récupère les infos de l'utilisateur depuis la base de données
      // Include: role permet de charger aussi les infos du rôle
      const user = await prisma.user.findUnique({
        where: { id: req.userId },
        include: { role: true },
      });

      // Vérifie si l'utilisateur existe et a un rôle autorisé
      if (!user || !allowedRoles.includes(user.role.name)) {
        return res.status(403).json({
          success: false,
          message: 'Accès refusé - Rôle insuffisant',
        });
      }

      next(); // Utilisateur autorisé, passe à la suite
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Erreur serveur',
      });
    }
  };
};

export { authMiddleware, roleMiddleware };
