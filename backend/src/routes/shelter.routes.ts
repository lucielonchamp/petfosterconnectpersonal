import express from "express";
import * as Controller from "../controllers/shelter.controller";

const router = express.Router();

/**
 * @swagger
 * tags:
 *  name: Shelters
 *  description: Shelter management
 */

/**
 * @swagger
 * /shelters:
 *  get:
 *    summary: Get all shelters
 *    tags: [Shelters]
*/
router.get("/", Controller.getShelters);

/**
 * @swagger
 * /shelters/{id}:
 *  get:
 *    summary: Get a shelter by ID
 *    tags: [Shelters]
 *    parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        description: The ID of the shelter
 */
router.get("/:id", Controller.getShelterById);

/**   
 * @swagger
 * /shelters:
 *  post:
 *    summary: Create a shelter
 *    tags: [Shelters]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 */
router.post("/", Controller.createShelter);

/**
 * @swagger
 * /shelters/{id}:
 *  put:
 *    summary: Update a shelter by ID
 *    tags: [Shelters]
 *    parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        description: The ID of the shelter
 */
router.put("/:id", Controller.updateShelter);

/**
 * @swagger
 * /shelters/{id}:
 *  delete:
 *    summary: Delete a shelter by ID
 *    tags: [Shelters]
 *    parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        description: The ID of the shelter
 */
router.delete("/:id");

export default router;
