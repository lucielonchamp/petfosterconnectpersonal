import express from 'express';
import * as Controller from '../controllers/user.controller';
import { upload } from '../utils/s3upload';
const router = express.Router();

/**
 * @swagger
 * tags:
 *  name: Users
 *  description: User management
 */

/**
 * @swagger
 * /user:
 *  get:
 *    summary: Get all users
 *    tags: [Users]
 *    responses:
 *      '200':
 *        description: A list of users
 */
router.get('/', Controller.getUsers);

/**
 * @swagger
 * /user/{id}:
 *  get:
 *    summary: Get a user by ID
 *    tags: [Users]
 *    parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        description: The ID of the user
 *    responses:
 *      200:
 *        description: A user
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 */
router.get('/:id', Controller.getUserById);

/**
 * @swagger
 * /user/{id}/shelter:
 *  get:
 *    summary: Get a user with shelter by ID
 *    tags: [Users]
 *    parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        description: The ID of the user
 */
router.get('/:id/shelter', Controller.getUserWithShelter);

/**
 * @swagger
 * /user/{id}/shelter:
 *  patch:
 *    summary: Update a user with shelter by ID
 *    tags: [Users]
 *    parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        description: The ID of the user
 *    requestBody:
 *      required: true
 *      content:
 *        multipart/form-data:
 *          schema:
 *            type: object
 *            properties:
 *              picture:
 *                type: string
 *                format: binary
 *              name:
 *                type: string
 */
router.patch('/:id/shelter', upload.single('picture'), Controller.updateUserWithShelter);

/**
 * @swagger
 * /user/{id}/foster:
 *  get:
 *    summary: Get a user with foster by ID
 *    tags: [Users]
 *    parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        description: The ID of the user
 */
router.get('/:id/foster', Controller.getUserWithFoster);

/**
 * @swagger
 * /user/{id}/foster:
 *  patch:
 *    summary: Update a user with foster by ID
 *    tags: [Users]
 *    parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        description: The ID of the user
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *              password:
 *                type: string
 *              roleId:
 *                type: string
 */
router.patch('/:id/foster', Controller.updateUserWithFoster);

/**
 * @swagger
 * /user/{id}:
 *  delete:
 *    summary: Delete a user by ID
 *    tags: [Users]
 *    parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        description: The ID of the user
 *    responses:
 *      200:
 *        description: A user
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 */
router.delete("/:id", Controller.anonymizeUser);

export default router;
