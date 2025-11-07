import { Router } from 'express';
import { creditController } from '../controllers/credit.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/balance', creditController.getBalance.bind(creditController));
router.post('/purchase', creditController.purchaseCredits.bind(creditController));
router.get('/transactions', creditController.getTransactionHistory.bind(creditController));

// Admin only routes
router.post('/bonus', authorize('admin'), creditController.addBonus.bind(creditController));
router.post('/refund', authorize('admin'), creditController.refundCredits.bind(creditController));

export default router;
