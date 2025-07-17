import { Router } from 'express';
import { 
    createLinkToken, 
    exchangePublicToken, 
    getBankAccounts,
    createAchPayment,
    handlePlaidWebhook
} from '../controllers/plaidController.js';

const router = Router();

router.post('/create_link_token', createLinkToken);
router.post('/exchange_public_token', exchangePublicToken);
router.get('/accounts', getBankAccounts);
router.post('/ach/payment', createAchPayment);
router.post('/webhook', handlePlaidWebhook);

export default router;