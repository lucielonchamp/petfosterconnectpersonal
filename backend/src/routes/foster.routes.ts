import * as Controller  from "../controllers/foster.controller";
import express from "express";

const router = express.Router();

/**
 * @swagger
 * tags:
 *  name: Fosters
 *  description: Foster management
 */

/**
 * @swagger
 * /foster:
 *  get:
 *    summary: Get all fosters
 *    tags: [Fosters]
 *    responses:
 *      200:
 *        description: A list of fosters
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 */
router.get('/', Controller.getFoster);

/**
 * @swagger
 * /foster:
 *  post:
 *    summary: Create a foster
 *    tags: [Fosters]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *    responses:
 *      201:
 *        description: A foster
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 */
router.post('/', Controller.createFoster);

/**
 * @swagger
 * /foster/{id}:
 *  get:
 *    summary: Get a foster by ID
 *    tags: [Fosters]
 *    parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        description: The ID of the foster
 *    responses:
 *      200:
 *        description: A foster
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 */
router.get('/:id', Controller.getFosterById);

/**
 * @swagger
 * /foster/{id}:
 *  put:
 *    summary: Update a foster by ID
 *    tags: [Fosters]
 *    parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        description: The ID of the foster
 *    responses:
 *      200:
 *        description: A foster
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 */
router.put('/:id/', Controller.updateFoster);

/**
 * @swagger
 * /foster/{id}/animals:
 *  get:
 *    summary: Get a foster by ID
 *    tags: [Fosters]
 *    parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        description: The ID of the foster
 *    responses:
 *      200:
 *        description: A foster
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 */
router.get('/:id/animals', Controller.getAnimalsByFoster);

export default router;
