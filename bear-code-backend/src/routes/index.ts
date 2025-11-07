import { Router } from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import creditRoutes from './credit.routes.js';
import searchRoutes from './search.routes.js';

const router = Router();

// Health check
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Bear Code API is running',
    timestamp: new Date().toISOString(),
  });
});

// API routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/credits', creditRoutes);
router.use('/search', searchRoutes);

export default router;
