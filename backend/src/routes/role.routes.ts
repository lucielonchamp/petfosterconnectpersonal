import express from 'express';
import * as Controller from '../controllers/role.controller';

const router = express.Router();

/**
 * @swagger
 * /role:
 *   get:
 *     summary: Get all roles
 *     description: Retrieve a list of available roles
 *     operationId: getRoles
 *     responses:
 *       200:
 *         description: A list of roles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *                 enum:
 *                   - foster
 *                   - shelter
 */

/**
 * @swagger
 * /role:
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

router.get('/', Controller.getRole);
router.post('/', Controller.createRole);

export default router;
