import { Router } from 'express';
import { searchController } from '../controllers/search.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { searchLimiter } from '../middleware/rateLimit.middleware.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.post('/index', searchController.indexCode.bind(searchController));
router.post('/query', searchLimiter, searchController.searchCode.bind(searchController));
router.get('/documents', searchController.getDocuments.bind(searchController));
router.delete('/documents/:documentId', searchController.deleteDocument.bind(searchController));
router.get('/history', searchController.getSearchHistory.bind(searchController));

export default router;
