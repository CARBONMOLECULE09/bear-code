import { Router } from 'express';
import { authController } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authLimiter } from '../middleware/rateLimit.middleware.js';

const router = Router();

// Public routes
router.post('/register', authLimiter, authController.register.bind(authController));
router.post('/login', authLimiter, authController.login.bind(authController));
router.post('/refresh', authLimiter, authController.refreshToken.bind(authController));

// Protected routes
router.get('/profile', authenticate, authController.getProfile.bind(authController));
router.post('/logout', authenticate, authController.logout.bind(authController));

export default router;
