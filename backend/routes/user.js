import { Router } from 'express';
import { getUser, updateUserWallet } from '../controllers/userController.js';

const router = Router();

router.get('/', getUser);
router.post('/wallet', updateUserWallet);

export default router;