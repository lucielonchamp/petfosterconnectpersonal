import { PrismaClient } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { LOGIN_COOKIES_OPTIONS } from '../utils/loginCookiesOptions';

const prisma = new PrismaClient();

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const { accessToken, refreshToken } = req.cookies;

  if (!accessToken && !refreshToken) {
    res.status(401).json({
      success: false,
      message: 'Authentification requise',
    });
    return;
  }

  if (accessToken) {
    try {
      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET!) as {
        userId: string;
      };

      req.userId = decoded.userId;
      next();
      return;
    } catch (error) {
      if (!(error instanceof jwt.TokenExpiredError)) {
        res.status(401).json({ success: false, message: "Token d'accès invalide" });
        console.error(error);
        return;
      }
    }
  }

  if (refreshToken) {
    try {
      const verified = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as {
        userId: string;
      };

      const newAccessToken = jwt.sign(
        { userId: verified.userId },
        process.env.ACCESS_TOKEN_SECRET!,
        {
          expiresIn: '10m',
        }
      );

      res.cookie('accessToken', newAccessToken, { ...LOGIN_COOKIES_OPTIONS, httpOnly: true });
      req.userId = verified.userId;
      next();
      return;
    } catch (error) {
      res.status(401).json({ success: false, message: 'Refresh token invalide' });
      console.error(error);
      return;
    }
  }

  res.status(401).json({ success: false, message: 'Authentification requise' });
};

const roleMiddleware = (allowedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!req.userId) {
      res.status(401).json({
        success: false,
        message: 'Authentification requise',
      });
      return;
    }

    try {
      const user = await prisma.user.findUnique({
        where: { id: req.userId },
        include: { role: true },
      });

      if (!user || !allowedRoles.includes(user.role.name)) {
        res.status(403).json({
          success: false,
          message: 'Accès refusé - Rôle insuffisant',
        });
        return;
      }

      next();
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur serveur',
      });
      return;
    }
  };
};

const isFosterOwnerMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const { fosterId } = req.params;
  const userId = req.userId;

  if (!userId) {
    res.status(401).json({
      success: false,
      message: 'Authentification requise',
    });
    return;
  }

  try {
    const foster = await prisma.foster.findUnique({
      where: { id: fosterId },
      select: { userId: true },
    });

    if (!foster) {
      res.status(404).json({
        success: false,
        message: 'Foster non trouvé',
      });
      return;
    }

    if (foster.userId !== userId) {
      res.status(403).json({
        success: false,
        message: "Vous n'êtes pas autorisé à accéder aux informations de ce foster",
      });
      return;
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
    });
    return;
  }
};

export { authMiddleware, roleMiddleware, isFosterOwnerMiddleware };
