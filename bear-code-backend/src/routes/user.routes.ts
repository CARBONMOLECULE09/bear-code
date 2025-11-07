import { Router } from 'express';
import { userController } from '../controllers/user.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/profile', userController.getProfile.bind(userController));
router.put('/profile', userController.updateProfile.bind(userController));
router.post('/change-password', userController.changePassword.bind(userController));
router.get('/stats', userController.getStats.bind(userController));
router.delete('/account', userController.deleteAccount.bind(userController));

export default router;
