import express from 'express';
import * as Controller from '../controllers/animal.controller';
import { authMiddleware, isFosterOwnerMiddleware, roleMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

/**
 * @swagger
 * /animal:
 *   get:
 *     summary: Récupère tous les animaux avec filtres
 *     tags: [Animals]
 *     parameters:
 *       - in: query
 *         name: sex
 *         schema:
 *           type: string
 *           enum: [Male, Female]
 *         description: Filtre par sexe
 *       - in: query
 *         name: specieId
 *         schema:
 *           type: string
 *         description: Filtre par espèce
 *       - in: query
 *         name: breed
 *         schema:
 *           type: string
 *         description: Filtre par race
 *       - in: query
 *         name: minAge
 *         schema:
 *           type: integer
 *         description: Âge minimum
 *       - in: query
 *         name: maxAge
 *         schema:
 *           type: integer
 *         description: Âge maximum
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [fostered, waiting, sheltered]
 *         description: Filtre par statut
 *       - in: query
 *         name: fosterId
 *         schema:
 *           type: string
 *         description: Filtre par ID de famille d'accueil
 *       - in: query
 *         name: shelterId
 *         schema:
 *           type: string
 *         description: Filtre par ID de refuge
 *     responses:
 *       200:
 *         description: Liste des animaux
 *       500:
 *         description: Erreur serveur
 * 
 *   post:
 *     summary: Crée un nouvel animal
 *     tags: [Animals]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - age
 *               - specieId
 *               - breed
 *               - description
 *               - sex
 *               - shelterId
 *             properties:
 *               name:
 *                 type: string
 *               age:
 *                 type: integer
 *               specieId:
 *                 type: string
 *               breed:
 *                 type: string
 *               description:
 *                 type: string
 *               sex:
 *                 type: string
 *                 enum: [Male, Female]
 *               shelterId:
 *                 type: string
 *               picture:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Animal créé avec succès
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non autorisé
 *       500:
 *         description: Erreur serveur
 * 
 * /animal/{id}:
 *   get:
 *     summary: Récupère un animal par son ID
 *     tags: [Animals]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Détails de l'animal
 *       404:
 *         description: Animal non trouvé
 *       500:
 *         description: Erreur serveur
 * 
 *   put:
 *     summary: Met à jour un animal
 *     tags: [Animals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               age:
 *                 type: integer
 *               specieId:
 *                 type: string
 *               breed:
 *                 type: string
 *               description:
 *                 type: string
 *               sex:
 *                 type: string
 *                 enum: [Male, Female]
 *               shelterId:
 *                 type: string
 *               picture:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Animal mis à jour
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non autorisé
 *       404:
 *         description: Animal non trouvé
 *       500:
 *         description: Erreur serveur
 * 
 *   delete:
 *     summary: Supprime un animal
 *     tags: [Animals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Animal supprimé
 *       401:
 *         description: Non autorisé
 *       404:
 *         description: Animal non trouvé
 *       500:
 *         description: Erreur serveur
 * 
 * /animal/shelter/{shelterId}:
 *   get:
 *     summary: Récupère les animaux d'un refuge
 *     tags: [Animals]
 *     parameters:
 *       - in: path
 *         name: shelterId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des animaux du refuge
 *       404:
 *         description: Refuge non trouvé
 *       500:
 *         description: Erreur serveur
 * 
 * /animal/foster/{fosterId}:
 *   get:
 *     summary: Récupère les animaux d'une famille d'accueil
 *     tags: [Animals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: fosterId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des animaux de la famille d'accueil
 *       401:
 *         description: Non autorisé
 *       404:
 *         description: Famille d'accueil non trouvée
 *       500:
 *         description: Erreur serveur
 */

router.get('/', Controller.getAnimals);
router.get('/:id', Controller.getAnimalById);
router.post('/', authMiddleware, roleMiddleware(['shelter']), Controller.createAnimal);
router.put('/:id', authMiddleware, roleMiddleware(['shelter']), Controller.updateAnimal);
router.delete('/:id', authMiddleware, roleMiddleware(['shelter']), Controller.deleteAnimal);
router.get('/shelter/:shelterId', Controller.getAnimalsByShelter);
router.get('/foster/:fosterId', authMiddleware, roleMiddleware(['foster']), isFosterOwnerMiddleware, Controller.getAnimalsByFoster);

export default router;
