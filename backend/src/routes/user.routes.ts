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
 * /user:
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
router.get("/:id", Controller.getUserById);

/**
 * @swagger
 * /user/{id}:
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
router.delete("/:id", Controller.deleteUser);

export default router;
