import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { loginSchema, registerSchema } from '../schemas/auth.schema';
import { clearAuthCookies } from '../utils/clearAuthCookies';

const prisma = new PrismaClient();

const isProduction = process.env.NODE_ENV === 'production'

const LOGIN_COOKIES_OPTIONS = {
  secure: isProduction,
  sameSite: 'lax' as const,
  httpOnly: true,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export async function register(request: Request, response: Response): Promise<any> {
  const requestedData = request.body;

  const { success, error, data } = registerSchema.safeParse(requestedData);

  if (!success) {
    return response.status(400).json({
      success: false,
      message: 'Invalid data',
      error: error,
    });
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (existingUser) {
      return response.status(500).json({ success: false, message: 'Email already used.' });
    }

    const salt = bcrypt.genSaltSync(Number(process.env.SALT_ROUNDS) || 10);
    const hash = bcrypt.hashSync(data.password, Number(process.env.SALT_ROUNDS) || 10);

    const newUser = await prisma.user.create({
      data: {
        email: data.email,
        password: hash,
        role: {
          connect: {
            id: data.roleId,
          },
        },
      },
    });

    return response.status(200).json({ success: true, message: 'User created !', data: newUser });
  } catch (error) {
    return response.status(500).json({ success: false, message: 'Server error', error: error });
  }
}

export const login = async (req: Request, res: Response): Promise<any> => {
  const requestedData = req.body;

  const { success, error } = loginSchema.safeParse(requestedData);

  if (!success) {
    return res.status(400).json({
      success: false,
      message: 'Invalid data',
      error: error,
    });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Email and password required' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      res.status(400).json({ success: false, message: 'Email does not exists' });
      return;
    }

    const passwordCheck = await bcrypt.compare(password, user.password);

    if (!passwordCheck) {
      res.status(400).json({ success: false, message: 'Incorrect password' });
      return;
    }

    const authToken = jwt.sign(
      {
        userId: user.id,
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: '24h',
      }
    );

    res.cookie('authToken', authToken, { ...LOGIN_COOKIES_OPTIONS });

    res.status(200).json({
      success: true,
      message: 'Connexion réussie 😄!',
      authToken,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// Récupère les informations de l'utilisateur connecté
export const getMe = async (req: Request, res: Response): Promise<any> => {
  // Vérifie si un userId est présent dans la requête (mis par le authMiddleware)
  if (!req.userId) {
    return res.status(401).json({
      success: false,
      message: 'Non authentifié',
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.userId, // On utilise l'ID stocké par le middleware
      },
      include: {
        role: true, // Charge la relation role pour avoir les permissions
        Shelter: true,
        Foster: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé',
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur',
    });
  }
};

export const logout = async (req: Request, res: Response): Promise<any> => {
  try {
    const logoutCookiesOptions: { secure: boolean; sameSite: 'none' | 'lax' | 'strict' } = {
      secure: process.env.NODE_ENV === 'production',
      sameSite: isProduction ? 'none' : 'lax',
    };

    clearAuthCookies(res, logoutCookiesOptions);

    return res.status(200).json({
      success: true,
      message: 'Déconnexion réussie',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la déconnexion',
    });
  }
};
