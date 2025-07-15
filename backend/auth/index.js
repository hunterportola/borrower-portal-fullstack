// Main auth module exports for easy importing
export { default as auth } from './config/auth-config.js';
export { RavenDBAdapter } from './adapters/ravendb-adapter.js';
export { requireAuth, optionalAuth, requireRole } from './middleware/auth-middleware.js';
export { default as authRoutes } from './routes/auth-routes.js';
export * as sessionUtils from './utils/session-utils.js';

// Convenience function to initialize auth with custom config
export const createAuth = (customConfig = {}) => {
    const { betterAuth } = require('better-auth');
    const { RavenDBAdapter } = require('./adapters/ravendb-adapter.js');
    
    const defaultConfig = {
        database: new RavenDBAdapter(),
        emailAndPassword: { enabled: true },
        session: {
            expiresIn: 60 * 60 * 24 * 7, // 7 days
            updateAge: 60 * 60 * 24, // 1 day
        },
        secret: process.env.BETTER_AUTH_SECRET || 'your-secret-key-here',
        baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3001',
    };

    const config = { ...defaultConfig, ...customConfig };
    return betterAuth(config);
};

export default {
    auth,
    RavenDBAdapter,
    requireAuth,
    optionalAuth,
    requireRole,
    authRoutes,
    sessionUtils,
    createAuth,
};