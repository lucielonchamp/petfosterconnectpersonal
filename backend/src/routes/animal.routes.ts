import * as Controller from '../controllers/animal.controller';
import express from 'express';
import { authMiddleware, isFosterOwnerMiddleware, roleMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

/**
 * @swagger
 * /animals:
 *   get:
 *     summary: Get all animals
 *     description: Retrieve a list of available animals
 *     operationId: getAnimals
 *     responses:
 *       200:
 *         description: A list of animals
 *         content:
 *           application/json:
 *             schema:
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
