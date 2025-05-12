import Token from 'csrf';
import { NextFunction, Request, Response } from 'express';

const tokens = new Token();

const secret = process.env.CSRF_SECRET || 'gros_secret';

export const generateCsrfToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!secret) {
      throw new Error('CSRF_SECRET non défini');
    }
    const token = tokens.create(secret);

    res.status(200).json({
      success: true,
      message: 'CSRF token généré avec succès',
      token: token,
    });
  } catch (error) {
    console.error('Erreur lors de la génération du token CSRF:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la génération du token CSRF',
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    });
  }
};

export const validateCsrfToken = (req: Request, res: Response, next: NextFunction) => {
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
    if (req.path === '/auth/login' || req.path === '/auth/register' || req.path === '/auth/logout') {
      next();
      return;
    }

    const token = req.headers['x-csrf-token'];
    const tokenString = Array.isArray(token) ? token[0] : token;

    if (!tokenString) {
      res.status(403).json({
        success: false,
        message: 'Token CSRF manquant',
      });
      return;
    }

    try {
      if (!secret) {
        throw new Error('CSRF_SECRET non défini');
      }
      const isValid = tokens.verify(secret, tokenString);

      if (!isValid) {
        res.status(403).json({
          success: false,
          message: 'Token CSRF invalide',
        });
        return;
      }
      next();
    } catch (error) {
      console.error('Erreur lors de la vérification du token CSRF:', error);
      res.status(403).json({
        success: false,
        message: 'Erreur lors de la vérification du token CSRF',
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    }
  } else {
    next();
  }
};





