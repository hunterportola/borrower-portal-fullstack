# Authentication Implementation

This project implements a comprehensive authentication system using BetterAuth with RavenDB integration.

## Architecture

The authentication system uses a hybrid approach:
- **BetterAuth**: Handles authentication logic, sessions, and user management
- **RavenDB**: Stores user documents and application-specific data
- **Sync Layer**: Bridges BetterAuth users with RavenDB documents

## Directory Structure

```
backend/auth/
├── adapters/
│   └── ravendb-adapter.js      # Custom RavenDB adapter (for future use)
├── config/
│   └── auth-config.js          # BetterAuth configuration
├── middleware/
│   └── auth-middleware.js      # Authentication middleware
├── routes/
│   └── auth-routes.js          # Authentication endpoints
├── utils/
│   ├── session-utils.js        # Session management utilities
│   └── ravendb-sync.js         # RavenDB synchronization utilities
└── index.js                    # Main exports
```

## Environment Variables

Required in `.env`:

```bash
# Authentication
BETTER_AUTH_SECRET=your-secret-key-here-needs-to-be-at-least-32-characters-long
BETTER_AUTH_URL=http://localhost:3001

# Database
RAVENDB_URL=http://localhost:8080
RAVENDB_DATABASE=BorrowerPortal
```

## Available Endpoints

### Authentication Endpoints (via BetterAuth)
- `POST /api/auth/sign-up` - User registration
- `POST /api/auth/sign-in` - User login
- `POST /api/auth/sign-out` - User logout
- `GET /api/auth/session` - Get current session

### Protected Endpoints
- `GET /api/user` - Get current user (requires auth)
- `POST /api/user/wallet` - Update wallet address (requires auth)
- `GET /api/loan` - Get user's loan details (requires auth)

## Usage Examples

### User Registration
```bash
curl -X POST http://localhost:3001/api/auth/sign-up \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### User Login
```bash
curl -X POST http://localhost:3001/api/auth/sign-in \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword"
  }'
```

### Access Protected Resource
```bash
curl -X GET http://localhost:3001/api/user \
  -H "Cookie: better-auth.session_token=YOUR_SESSION_TOKEN"
```

## How It Works

1. **Authentication**: BetterAuth handles user registration, login, and session management
2. **Synchronization**: When a user accesses protected resources, the system automatically syncs their BetterAuth user data to RavenDB
3. **Data Storage**: User-specific application data (loans, wallet addresses, etc.) is stored in RavenDB documents
4. **Session Management**: BetterAuth manages sessions using cookies/tokens

## Key Features

- **Automatic User Sync**: BetterAuth users are automatically synced to RavenDB when needed
- **Seamless Integration**: Existing RavenDB operations work unchanged
- **Session-based Auth**: Secure session management with configurable expiration
- **Middleware Protection**: Easy route protection with `requireAuth` middleware
- **Additional User Fields**: Support for custom fields (firstName, lastName, phoneNumber, etc.)

## Middleware Usage

```javascript
import { requireAuth, optionalAuth } from './auth/middleware/auth-middleware.js';

// Require authentication
router.get('/protected', requireAuth, controller);

// Optional authentication
router.get('/public', optionalAuth, controller);
```

## Reusability

The entire `auth/` directory can be copied to new projects. Simply:
1. Update import paths for `config/db.js`
2. Modify user fields in `auth-config.js`
3. Update environment variables
4. Add auth routes to your main router

## Current State

- ✅ BetterAuth configured and working
- ✅ RavenDB integration via sync layer
- ✅ All routes protected with authentication
- ✅ Environment variables configured
- ⚠️ Using memory adapter (development only)
- 🔄 Custom RavenDB adapter ready but commented out (needs further testing)

## Future Enhancements

- Enable custom RavenDB adapter for production
- Add OAuth providers (Google, GitHub, etc.)
- Implement role-based access control
- Add email verification
- Add password reset functionality