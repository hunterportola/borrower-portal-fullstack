import { plaidClient } from '../config/plaid.js';
import store from '../config/db.js';

export const createLinkToken = async (req, res) => {
    try {
        const createTokenRequest = {
            user: { client_user_id: 'users/1' },
            client_name: 'Portola Borrower Portal',
            products: ['auth', 'transfer'],
            country_codes: ['US'],
            language: 'en',
        };
        const tokenResponse = await plaidClient.linkTokenCreate(createTokenRequest);
        res.json(tokenResponse.data);
    } catch (error) {
        console.error("Error creating Plaid link token:", error.response?.data);
        res.status(500).json({ error: 'Failed to create Plaid link token' });
    }
};

export const exchangePublicToken = async (req, res) => {
    const session = store.openSession();
    try {
        const { public_token } = req.body;
        const exchangeResponse = await plaidClient.itemPublicTokenExchange({ public_token });
        const accessToken = exchangeResponse.data.access_token;
        
        await session.store({
            userId: 'users/1',
            plaidAccessToken: accessToken,
            type: 'plaidItem'
        }, `plaidItems/`);

        await session.saveChanges();
        res.json({ success: true });
    } catch (error) {
        console.error("Error exchanging public token:", error.response?.data);
        res.status(500).json({ error: 'Failed during Plaid integration' });
    }
};

export const getBankAccounts = async (req, res) => {
    const session = store.openSession();
    const allAccounts = [];
    try {
        const plaidItems = await session.query({ collection: 'PlaidItems' })
            .whereEquals('userId', 'users/1')
            .all();

        for (const item of plaidItems) {
            const authResponse = await plaidClient.authGet({ access_token: item.plaidAccessToken });
            for (const account of authResponse.data.accounts) {
                allAccounts.push({
                    accountId: account.account_id,
                    accessToken: item.plaidAccessToken,
                    name: account.name,
                    mask: account.mask,
                    subtype: account.subtype,
                });
            }
        }
        res.json(allAccounts);
    } catch (error) {
        console.error("Could not fetch Plaid accounts", error);
        res.status(500).json({ error: "Failed to fetch accounts" });
    }
};

export const createAchPayment = async (req, res) => {
    const { amount, accessToken, accountId } = req.body;
    const session = store.openSession();
    
    if (!accessToken || !accountId) {
        return res.status(400).json({ success: false, error: "Missing payment credentials." });
    }

    try {
        const user = await session.load('users/1');
        const authRequest = {
            access_token: accessToken,
            account_id: accountId,
            type: 'debit',
            network: 'ach',
            amount: amount.toString(),
            user: { legal_name: `${user.firstName} ${user.lastName}` },
        };
        const authResponse = await plaidClient.transferAuthorizationCreate(authRequest);
        const authorizationId = authResponse.data.authorization.id;
        
        const createRequest = {
            access_token: accessToken,
            account_id: accountId,
            authorization_id: authorizationId,
            description: 'Loan Payment',
            ach_class: 'web',
        };
        const createResponse = await plaidClient.transferCreate(createRequest);
        res.json({ success: true, transfer: createResponse.data.transfer });
    } catch (error) {
        console.error("ACH Payment Error:", error.response?.data);
        res.status(500).json({ success: false, error: error.response?.data?.error_message || "An unknown error occurred." });
    }
};

export const handlePlaidWebhook = async (req, res) => {
    try {
        const webhookData = req.body;
        console.log('Received Plaid webhook:', webhookData);
        res.json({ received: true });
    } catch (error) {
        console.error('Webhook error:', error);
        res.status(500).json({ error: 'Webhook processing failed' });
    }
};