import express from "express";
import * as Controller from '../controllers/auth.controller';

const router = express.Router();
/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Inscription d'un nouvel utilisateur
 *     description: Permet d'inscrire un nouvel utilisateur avec un email unique et un rôle défini.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - roleId
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: password123
 *               roleId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       201:
 *         description: Inscription réussie
 *       400:
 *         description: Email invalide, mot de passe trop court
 *       409:
 *         description: Conflit - L'email est déjà utilisé
 *       500:
 *         description: Erreur interne du serveur
 */
router.post('/register', Controller.register);

/**
 * @swagger
 * /auth/login:
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