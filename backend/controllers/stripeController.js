import { stripe } from '../config/stripe.js';
import store from '../config/db.js';

export const createSetupIntent = async (req, res) => {
    const session = store.openSession();
    const user = await session.load('users/1');
    if (!user.stripeCustomerId) return res.status(500).json({ error: 'Stripe customer not initialized.' });
    
    try {
        const setupIntent = await stripe.setupIntents.create({
            customer: user.stripeCustomerId,
            payment_method_types: ['card'],
        });
        res.send({ clientSecret: setupIntent.client_secret });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create setup intent' });
    }
};

export const listPaymentMethods = async (req, res) => {
    const session = store.openSession();
    const user = await session.load('users/1');
    if (!user.stripeCustomerId) return res.status(500).json({ error: 'Stripe customer not initialized.' });

    try {
        const paymentMethods = await stripe.paymentMethods.list({
            customer: user.stripeCustomerId,
            type: 'card',
        });
        res.json(paymentMethods.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to list payment methods' });
    }
};

export const deletePaymentMethod = async (req, res) => {
    try {
        const { paymentMethodId } = req.params;
        const detachedPaymentMethod = await stripe.paymentMethods.detach(paymentMethodId);
        res.json({ success: true, detachedPaymentMethod });
    } catch (error) {
        res.status(500).json({ error: 'Failed to detach payment method' });
    }
};

export const createPaymentIntent = async (req, res) => {
    const session = store.openSession();
    const user = await session.load('users/1');
    if (!user.stripeCustomerId) return res.status(500).json({ error: 'Stripe customer not initialized.' });
  
    try {
        const { amount, payment_method } = req.body;
        const amountInCents = Math.round(parseFloat(amount) * 100);
        const intentOptions = {
            amount: amountInCents,
            currency: 'usd',
            customer: user.stripeCustomerId,
            ...(payment_method && { payment_method: payment_method, confirm: true, off_session: true })
        };
        const paymentIntent = await stripe.paymentIntents.create(intentOptions);
        res.send({
            clientSecret: paymentIntent.client_secret,
            status: paymentIntent.status,
        });
    } catch (error) {
        res.status(500).json({ error: error.message || 'Failed to create payment intent' });
    }
};