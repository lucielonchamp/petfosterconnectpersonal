import express from "express";
import * as Controller from "../controllers/user.controller";
const router = express.Router();

/**
 * @swagger
 * tags:
 *  name: Users
 *  description: User management
 */

/**
 * @swagger
 * /users:
 *  get:
 *    summary: Get all users
 *    tags: [Users]
 *    responses:
 *      '200':
 *        description: A list of users
 */
router.get("/", Controller.getUsers);

/**
 * @swagger
 * /users/{id}:
 *  get:
 *    summary: Get a user by ID
 *    tags: [Users]
 *    parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        description: The ID of the user
 */
router.get("/:id", Controller.getUserById);

/**
 * @swagger
 * /users/{id}:
 *  patch:
 *    summary: Update a user by ID
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
router.patch("/:id", Controller.updateUser);

/**
 * @swagger
 * /users/{id}:
 *  delete:
 *    summary: Delete a user by ID
 *    tags: [Users]
 *    parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        description: The ID of the user
 */
router.delete("/:id", Controller.deleteUser);

export default router;