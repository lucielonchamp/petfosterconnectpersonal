import express from "express";
import * as Controller from '../controllers/auth';

const router = express.Router();

/**
 * @description Register new user
 * @tags auth
 * @name register
 */
router.post('/register', Controller.register);

router.post('/login');


export default router;