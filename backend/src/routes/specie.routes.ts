import { Router } from 'express';
import { getSpecies } from '../controllers/specie.controller';

const router = Router();

router.get('/', getSpecies);

export default router; 