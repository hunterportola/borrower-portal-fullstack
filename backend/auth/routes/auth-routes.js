import { Router } from 'express';
import auth from '../config/auth-config.js';

const router = Router();

// Test route to verify router is working
router.get('/test', (req, res) => {
    res.json({ message: 'Auth routes are working!' });
});

// BetterAuth handler - handles all auth-related requests
router.all('*', async (req, res) => {
    try {
        console.log('🔐 Auth request received:', req.method, req.originalUrl, req.url);
        
        // Create the full URL for BetterAuth
        const fullUrl = `${process.env.BETTER_AUTH_URL || 'http://localhost:3001'}${req.originalUrl}`;
        console.log('🔗 Full URL:', fullUrl);
        
        // Create a proper request object for BetterAuth
        const request = new Request(fullUrl, {
            method: req.method,
            headers: {
                'content-type': 'application/json',
                ...req.headers,
            },
            body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
        });

        console.log('📤 Calling BetterAuth handler...');
        const response = await auth.handler(request);
        
        console.log('📥 Auth response status:', response.status);
        
        // Set status code
        res.status(response.status || 200);

        // Set headers
        response.headers.forEach((value, key) => {
            res.setHeader(key, value);
        });

        // Send response
        const responseText = await response.text();
        console.log('📝 Response text:', responseText);
        
        if (responseText) {
            try {
                const responseJson = JSON.parse(responseText);
                res.json(responseJson);
            } catch {
                res.send(responseText);
            }
        } else {
            res.end();
        }
    } catch (error) {
        console.error('❌ Auth route error:', error);
        res.status(500).json({ 
            error: 'Internal Server Error',
            message: 'Authentication handler failed',
            details: error.message
        });
    }
});

export default router;