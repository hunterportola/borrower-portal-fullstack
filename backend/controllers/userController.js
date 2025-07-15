import store from '../config/db.js';

export const getUser = async (req, res) => {
    const session = store.openSession();
    const user = await session.load('users/1');
    res.json(user);
};

export const updateUserWallet = async (req, res) => {
    const session = store.openSession();
    try {
        const { walletAddress } = req.body;
        const user = await session.load('users/1');
        if (user) {
            user.walletAddress = walletAddress;
            await session.saveChanges();
            res.json({ success: true, user });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to save wallet address' });
    }
};