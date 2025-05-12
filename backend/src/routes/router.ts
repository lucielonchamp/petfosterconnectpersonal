import express from 'express';
import animalRoute from './animal.routes';
import authRoute from './auth.routes';
import fosterRoute from './foster.routes';
import requestRoute from './request.routes';
import roleRoute from './role.routes';
import shelterRoute from './shelter.routes';
import specieRoute from './specie.routes';
import userRoute from './user.routes';

const router = express.Router();

router.use('/auth', authRoute);
router.use('/user', userRoute);
router.use('/request', requestRoute);
router.use('/role', roleRoute);
router.use('/animal', animalRoute);
router.use('/shelter', shelterRoute);
router.use('/foster', fosterRoute);
router.use('/species', specieRoute);

// 404
router.get('*', function (req, res) {
  res.json({
    success: false,
    errorCode: 404,
    error: 'Unknown entrypoint',
  });
});

export default router;
