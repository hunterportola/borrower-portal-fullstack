import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import store from './config/db.js';
import apiRoutes from './routes/index.js'; // We will create this next

const app = express();
const port = process.env.PORT || 3001;

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- API Routes ---
app.use('/api', apiRoutes);


// --- Database Seeding and Server Start ---
const seedDatabase = async () => {
    const session = store.openSession();
    
    let user = await session.load('users/1');
    if (!user) {
        console.log("Seeding user document...");
        user = {
            id: 'users/1',
            firstName: 'John',
            lastName: 'Harper',
            email: 'Harper5755@yopmail.com',
            stripeCustomerId: null,
            walletAddress: null,
            phoneNumber: '555-123-4567',
            maritalStatus: 'Married',
            education: 'Bachelor\'s degree',
        };
        await session.store(user);
    }

    const loanExists = await session.load('loans/1');
    if (!loanExists) {
        console.log("Seeding loan document...");
        await session.store({
            id: 'loans/1',
            userId: 'users/1',
            originalAmount: 7000.00,
            outstandingBalance: 6440.32,
            nextPaymentAmount: 3.45,
        });
    }

    await session.saveChanges();
    console.log("Database seeding complete.");

    // This logic should ideally be tied to a user creation event
    if (!user.stripeCustomerId) {
        // In a real app, you wouldn't use a global Stripe object like this
        // but for our single-user case it's fine.
        const { default: Stripe } = await import('stripe');
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-06-20' });

        console.log("Creating Stripe customer for user users/1...");
        const customer = await stripe.customers.create({
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
        });
        user.stripeCustomerId = customer.id;
        await session.saveChanges();
        console.log(`✅ Stripe customer created: ${customer.id}`);
    }
};

const startServer = async () => {
    await seedDatabase();
    app.listen(port, () => {
      console.log(`Backend server listening at http://localhost:${port}`);
    });
};

startServer();