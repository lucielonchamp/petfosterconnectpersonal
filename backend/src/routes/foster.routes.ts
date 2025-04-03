import * as Controller  from "../controllers/foster.controller";
import express from "express";


const router = express.Router();

router.post('/', Controller.createFoster);
router.get('/', Controller.getFoster);
router.get('/:id', Controller.getFosterById);
router.put('/:id/', Controller.updateFoster);
router.get('/:id/animals', Controller.getAnimalsByFoster);
router.delete('/:id/', Controller.deleteFoster);

export default router;
