import { Router } from 'express';
import { getLoanDetails } from '../controllers/loanController.js';
import { requireAuth } from '../auth/middleware/auth-middleware.js';

const router = Router();

router.get('/', requireAuth, getLoanDetails);

export default router;