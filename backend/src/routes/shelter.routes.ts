import express from 'express';
import * as Controller from '../controllers/shelter.controller';

const router = express.Router();

/**
 * @swagger
 * tags:
 *  name: Shelters
 *  description: Shelter management
 */

/**
 * @swagger
 * /shelter:
 *  get:
 *    summary: Get all shelters
 *    tags: [Shelters]
 *    responses:
 *      200:
 *        description: A list of shelters
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 */
router.get('/', Controller.getShelters);

/**
 * @swagger
 * /shelter/{id}:
 *  get:
 *    summary: Get a shelter by ID
 *    tags: [Shelters]
 *    parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        description: The ID of the shelter
 *    responses:
 *      200:
 *        description: A shelter
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 */
router.get('/:id', Controller.getShelterById);

/**
 * @swagger
 * /shelter:
 *  post:
 *    summary: Create a shelter
 *    tags: [Shelters]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *    responses:
 *      201:
 *        description: A shelter
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 */
router.post('/', Controller.createShelter);

/**
 * @swagger
 * /shelter/{id}:
 *  put:
 *    summary: Update a shelter by ID
 *    tags: [Shelters]
 *    parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        description: The ID of the shelter
 *    responses:
 *      200:
 *        description: A shelter
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 */
router.put('/:id', Controller.updateShelter);

export default router;
