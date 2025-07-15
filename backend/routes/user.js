import { Router } from 'express';
import { getUser, updateUserWallet } from '../controllers/userController.js';
import { requireAuth } from '../auth/middleware/auth-middleware.js';

const router = Router();

router.get('/', requireAuth, getUser);
router.post('/wallet', requireAuth, updateUserWallet);

export default router;