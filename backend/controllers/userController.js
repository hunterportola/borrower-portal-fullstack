import store from '../config/db.js';
import { getRavenUserFromAuth } from '../auth/utils/ravendb-sync.js';

export const getUser = async (req, res) => {
    try {
        const user = await getRavenUserFromAuth(req);
        
        if (!user) {
            return res.status(401).json({ error: 'Authentication required' });
        }
        
        res.json(user);
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Failed to get user' });
    }
};

export const updateUserWallet = async (req, res) => {
    try {
        const user = await getRavenUserFromAuth(req);
        
        if (!user) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        const { walletAddress } = req.body;
        const session = store.openSession();
        
        user.walletAddress = walletAddress;
        user.updatedAt = new Date();
        await session.saveChanges();
        
        res.json({ success: true, user });
    } catch (error) {
        console.error('Update wallet error:', error);
        res.status(500).json({ error: 'Failed to save wallet address' });
    }
};