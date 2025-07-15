import { Router } from 'express';
import userRoutes from './user.js';
import loanRoutes from './loan.js';
import plaidRoutes from './plaid.js';
import stripeRoutes from './stripe.js';
import activityRoutes from './activity.js';
import authRoutes from '../auth/routes/auth-routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/loan', loanRoutes);
router.use('/plaid', plaidRoutes);
router.use('/stripe', stripeRoutes);
router.use('/activities', activityRoutes);

export default router;