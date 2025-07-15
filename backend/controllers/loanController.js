import store from '../config/db.js';

export const getLoanDetails = async (req, res) => {
    const session = store.openSession();
    // In a real multi-user app, you would get the userId from the request
    const loan = await session.query({ collection: 'Loans' })
        .whereEquals('userId', 'users/1')
        .firstOrNull();

    if (loan) {
        res.json(loan);
    } else {
        res.status(404).json({ error: 'Loan not found for this user.' });
    }
};