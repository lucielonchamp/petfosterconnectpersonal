import express from 'express';
import * as Controller from '../controllers/animal.controller';
import { authMiddleware, isFosterOwnerMiddleware, roleMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

/**
 * @swagger
 * /animal:
 *   get:
 *     summary: Get all animals with filters
 *     description: Retrieve a list of animals with optional filters
 *     operationId: getAnimals
 *     parameters:
 *       - in: query
 *         name: sex
 *         schema:
 *           type: string
 *           enum: [Male, Female]
 *         description: Filter by animal sex (male/female)
 *       - in: query
 *         name: specieId
 *         schema:
 *           type: string
 *         description: Filter by specie ID
 *       - in: query
 *         name: breed
 *         schema:
 *           type: string
 *         description: Filter by breed
 *       - in: query
 *         name: minAge
 *         schema:
 *           type: integer
 *         description: Minimum age of animals
 *       - in: query
 *         name: maxAge
 *         schema:
 *           type: integer
 *         description: Maximum age of animals
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [fostered, waiting, sheltered]
 *         description: Filter by animal status
 *       - in: query
 *         name: fosterId
 *         schema:
 *           type: string
 *         description: Filter by foster ID
 *       - in: query
 *         name: shelterId
 *         schema:
 *           type: string
 *         description: Filter by shelter ID
 *     responses:
 *       200:
 *         description: A filtered list of animals
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Animal'
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /roles:
 *   post:
 *     summary: Create a new role
 *     description: Create a new role by providing its name
 *     operationId: createRole
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the role to be created
 *                 example: "admin"
 *     responses:
 *       201:
 *         description: Role successfully created
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
 *                   example: "Role successfully created"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "admin"
 *       409:
 *         description: Role already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "This role already exists"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Server error"
 */

router.get('/', Controller.getAnimals);
router.get('/:id', Controller.getAnimalById);
router.post('/add', Controller.createAnimal);
router.get('/shelter/:shelterId', Controller.getAnimalsByShelter);
router.get('/foster/:fosterId', authMiddleware, roleMiddleware(['foster']), isFosterOwnerMiddleware, Controller.getAnimalsByFoster);

export default router;
