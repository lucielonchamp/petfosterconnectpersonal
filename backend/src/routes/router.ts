import express from 'express';
import authRoute from './auth.routes';
import userRoute from './user.routes';

const router = express.Router();

router.use('/auth', authRoute);
router.use('/user', userRoute);

// 404
router.get('*', function (req, res) {
  res.json({
    success: false,
    errorCode: 404,
    error: 'Unknown entrypoint'
  });
});

export default router;