import { Router } from 'express';
import { getLoanDetails } from '../controllers/loanController.js';

const router = Router();

router.get('/', getLoanDetails);

export default router;