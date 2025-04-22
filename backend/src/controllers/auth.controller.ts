import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { loginSchema, registerSchema } from '../schemas/auth.schema';

const prisma = new PrismaClient();

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

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(data.password, salt);

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

    const token = jwt.sign(
      {
        userId: user.id,
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: '1h',
      }
    );

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
      maxAge: 60 * 60 * 1000, // 1H (pour correspondre à expiresIn du token)
    };

    res.cookie('authToken', token, cookieOptions);

    res.status(200).json({
      success: true,
      message: 'Connexion réussie 😄!',
      token: token,
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
    // Recherche l'utilisateur dans la base de données avec son ID
    // Include: role permet de charger aussi les informations du rôle
    const user = await prisma.user.findUnique({
      where: {
        id: req.userId, // On utilise l'ID stocké par le middleware
      },
      include: {
        role: true, // Charge la relation role pour avoir les permissions
      },
    });

    // Si l'utilisateur n'existe pas en base (cas rare mais possible)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé',
      });
    }

    // Renvoie les données utilisateur au format attendu par le front
    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    // En cas d'erreur avec la base de données
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur',
    });
  }
};

// Déconnecte l'utilisateur en supprimant son cookie
export const logout = async (req: Request, res: Response): Promise<any> => {
  try {
    // Supprime le cookie contenant le token JWT
    res.clearCookie('authToken', {
      httpOnly: true, // Le cookie n'est pas accessible en JavaScript
      secure: process.env.NODE_ENV === 'production', // HTTPS en production
      sameSite: 'strict' as const, // Protection CSRF
    });

    // Confirme la déconnexion
    return res.status(200).json({
      success: true,
      message: 'Déconnexion réussie',
    });
  } catch (error) {
    // En cas d'erreur lors de la suppression du cookie
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la déconnexion',
    });
  }
};
