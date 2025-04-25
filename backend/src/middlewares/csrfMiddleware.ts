import Token from 'csrf';
import { NextFunction, Request, Response } from 'express';

const tokens = new Token();

const secret = process.env.CSRF_SECRET;

export const generateCsrfToken = (req: Request, res: Response, next: NextFunction) => {
  if (!secret) {
    res.status(500).json({
      success: false,
      message: 'CSRF secret not set',
    });
    return;
  }

  const token = tokens.create(secret);
  const tokenString = Array.isArray(token) ? token[0] : String(token);

  res.status(200).json({
    success: true,
    message: 'CSRF token generated',
    token: tokenString,
  });
};

export const validateCsrfToken = (req: Request, res: Response, next: NextFunction) => {
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
    if (req.path === '/auth/login' || req.path === '/auth/register' || req.path === '/auth/logout') {
      next();
      return;
    }

    const token = req.headers['x-csrf-token'];
    const tokenString = Array.isArray(token) ? token[0] : String(token);

    if (!token) {
      res.status(403).json({
        success: false,
        message: 'CSRF token missing',
      });
      return;
    }

    try {
      if (!secret) {
        res.status(500).json({
          success: false,
          message: 'CSRF secret not set',
        });
        return;
      }

      const isValid = tokens.verify(secret, tokenString);

      if (!isValid) {
        res.status(403).json({
          success: false,
          message: 'CSRF invalid.',
        });
        return;
      }
      next();
    } catch (error) {
      res.status(403).json({
        success: false,
        message: 'Error verifying CSRF token',
      });
      return;
    }
  } else {
    next();
  }
};
