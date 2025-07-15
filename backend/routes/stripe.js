import { Router } from 'express';
import {
    createSetupIntent,
    listPaymentMethods,
    deletePaymentMethod,
    createPaymentIntent
} from '../controllers/stripeController.js';

const router = Router();

router.post('/create-setup-intent', createSetupIntent);
router.get('/payment-methods', listPaymentMethods);
router.delete('/payment-methods/:paymentMethodId', deletePaymentMethod);
router.post('/create-payment-intent', createPaymentIntent);

export default router;