// src/routes/request.routes.ts

import express from 'express';
import * as Controller from '../controllers/request.controller'; // Adjust path as needed
import { authMiddleware, roleMiddleware } from '../middlewares/authMiddleware';
import { RoleEnum } from '../interfaces/role';
// Assuming you might want to protect these routes later:
// import { authMiddleware } from '../middlewares/authMiddleware'; // Example

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Requests
 *   description: API pour la gestion des demandes de famille d'accueil (Requests)
 */

// TODO : route admin pour récupérer toutes les requêtes 

/**
 * @swagger
 * /request:
 *   post:
 *     tags: [Requests]
 *     summary: Créer une nouvelle demande
 *     description: Permet à une famille d'accueil (Foster) de créer une demande pour un animal spécifique d'un refuge. Le statut initial sera 'pending'.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateRequestBody'
 *     responses:
 *       201:
 *         description: Demande créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Request successfully created"
 *                 data:
 *                   $ref: '#/components/schemas/Request'
 *       400:
 *         description: Données d'entrée invalides (format UUID incorrect, IDs manquants, animal n'appartient pas au refuge, etc.)
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Animal, Foster ou Shelter non trouvé (si vérification implémentée)
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/', authMiddleware, Controller.createRequest);


/**
 * @swagger
 * /request/user/{id}:
 *   get:
 *     tags: [Requests]
 *     summary: Récupérer les demandes associées à un utilisateur spécifique
 *     description: Récupère une liste de toutes les demandes où l'utilisateur spécifié est soit le Foster (via son profil Foster), soit le propriétaire du Shelter (via son profil Shelter). Nécessite une authentification.
 *     security:
 *       - cookieAuth: [] # Ou bearerAuth: [], selon votre configuration
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID de l'utilisateur dont on veut récupérer les demandes associées.
 *     responses:
 *       200:
 *         description: Liste des demandes récupérée avec succès (peut être vide si l'utilisateur n'a pas de profil pertinent ou pas de demandes).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Requests for foster profile [fosterId] successfully retrieved."
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Request' # Référence au schéma Request existant
 *       400:
 *         description: Format de l'ID utilisateur invalide.
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Authentification requise.
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *          description: Accès non autorisé (si vous ajoutez une vérification de permissions).
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Utilisateur non trouvé avec l'ID spécifié.
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Erreur interne du serveur.
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/user/:id', authMiddleware, Controller.getRequestsByUserId);

/**
 * @swagger
 * /request/{id}:
 *   get:
 *     tags: [Requests]
 *     summary: Récupérer une demande par son ID
 *     description: Récupère les détails complets d'une demande spécifique en utilisant son ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID de la demande à récupérer
 *     responses:
 *       200:
 *         description: Détails de la demande récupérés avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Request successfully retrieved"
 *                 data:
 *                   $ref: '#/components/schemas/Request' # Schéma complet ici
 *       400:
 *         description: Format de l'ID invalide
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Demande non trouvée
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id', authMiddleware, Controller.getRequestById);

/**
 * @swagger
 * /request/{id}:
 *   patch:
 *     tags: [Requests]
 *     summary: Mettre à jour une demande
 *     description: Permet de mettre à jour le statut et/ou les commentaires d'une demande existante. La date 'answeredDate' est mise à jour automatiquement si le statut change. Ne permet pas de changer fosterId, shelterId ou animalId.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID de la demande à mettre à jour
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateRequestBody'
 *     responses:
 *       200:
 *         description: Demande mise à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Request successfully updated"
 *                 data:
 *                   $ref: '#/components/schemas/Request' # Retourne la demande mise à jour
 *       400:
 *         description: Données d'entrée invalides (format ID, statut inconnu, commentaire trop long, tentative de modification des IDs clés)
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Demande non trouvée
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/ErrorResponse'
 */
router.patch('/:id', authMiddleware, Controller.updateRequest);

/**
 * @swagger
 * /request/{id}:
 *   delete:
 *     tags: [Requests]
 *     summary: Supprimer une demande
 *     description: Supprime une demande spécifique en utilisant son ID. 
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID de la demande à supprimer
 *     responses:
 *       200: # Ou 204 No Content si vous préférez ne pas renvoyer de corps
 *         description: Demande supprimée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Request successfully deleted"
 *       400:
 *         description: Format de l'ID invalide
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Demande non trouvée
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/:id', authMiddleware, Controller.deleteRequest);

export default router;