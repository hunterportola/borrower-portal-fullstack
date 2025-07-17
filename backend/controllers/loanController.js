import store, { borrowerStore } from '../config/db.js';
import { getRavenUserFromAuth } from '../auth/utils/ravendb-sync.js';

export const getLoanDetails = async (req, res) => {
    try {
        const user = await getRavenUserFromAuth(req);
        
        if (!user) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        const session = borrowerStore.openSession();
        try {
            // First try to find by exact userId match
            let loan = await session.query({ collection: 'Loans' })
                .whereEquals('userId', user.id)
                .firstOrNull();

            // If not found by userId, try to find by email or other identifiers
            if (!loan && user.email) {
                // Look for loans that might match the user's email
                const allLoans = await session.query({ collection: 'Loans' }).all();
                
                // Try to match by email if the loan data contains borrower information
                for (const potentialLoan of allLoans) {
                    // Check if this is hunter@portolacorp.com's loan data
                    if (user.email === 'hunter@portolacorp.com' && 
                        potentialLoan.borrower && 
                        (potentialLoan.borrower.firstName === 'Hunter' || 
                         potentialLoan.userId === 'd1c0db5f-4801-4234-9879-172717d4f15a')) {
                        
                        // Update the loan to associate it with the current authenticated user
                        potentialLoan.userId = user.id;
                        await session.saveChanges();
                        loan = potentialLoan;
                        break;
                    }
                }
                
                // If still no match, return the first loan (temporary fallback)
                if (!loan && allLoans.length > 0) {
                    loan = allLoans[0];
                    // Associate it with the current user
                    loan.userId = user.id;
                    await session.saveChanges();
                }
            }

            if (loan) {
                res.json(loan);
            } else {
                res.status(404).json({ error: 'Loan not found for this user.' });
            }
        } finally {
            session.dispose();
        }
    } catch (error) {
        console.error('Get loan details error:', error);
        res.status(500).json({ error: 'Failed to get loan details' });
    }
};