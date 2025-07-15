import store from '../config/db.js';
import { getRavenUserFromAuth } from '../auth/utils/ravendb-sync.js';

export const getLoanDetails = async (req, res) => {
    try {
        const user = await getRavenUserFromAuth(req);
        
        if (!user) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        const session = store.openSession();
        const loan = await session.query({ collection: 'Loans' })
            .whereEquals('userId', user.id)
            .firstOrNull();

        if (loan) {
            res.json(loan);
        } else {
            res.status(404).json({ error: 'Loan not found for this user.' });
        }
    } catch (error) {
        console.error('Get loan details error:', error);
        res.status(500).json({ error: 'Failed to get loan details' });
    }
};