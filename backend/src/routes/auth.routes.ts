import express from "express";
import * as Controller from '../controllers/auth.controller';

const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   get:
 *     tags:
 *       - Authentication
 *     summary: Inscription d'un nouvel utilisateur
 *     description: Permet d'inscrire un nouvel utilisateur
 *     responses:
 *       200:
 *         description: Inscription réussie
 *       400:
 *         description: Erreur dans les données
 */
router.get('/register', Controller.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Connexion utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Connexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Email ou mot de passe incorrect
 */
router.post('/login');


export default router;