# 🚀 Borrower Portal - Startup Guide

## Quick Start

### 1. Start Backend (Port 3001)
```bash
cd backend
./start-server.sh
# OR manually:
# npm run dev
```

### 2. Start Frontend (Port 5173)
```bash
cd frontend  
npm run dev
```

### 3. Access Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001/api
- **Auth Test**: http://localhost:3001/api/auth/test

## 🔧 Troubleshooting

### Backend Issues

**"Port 3001 already in use"**
```bash
# Kill process using port 3001
lsof -ti:3001 | xargs kill -9
# Then restart
npm run dev
```

**"App crashed - waiting for file changes"**
- Usually means port conflict or missing environment variables
- Check `.env` file exists and has proper values
- Use the `start-server.sh` script which handles port conflicts

**"BetterAuth initialization failed"**
- Ensure `BETTER_AUTH_SECRET` is at least 32 characters
- Check all required environment variables in `.env`

### Frontend Issues

**"Cannot connect to backend"**
- Ensure backend is running on port 3001
- Check `src/lib/auth.ts` has correct baseURL

**"Authentication not working"**
- Clear browser cookies/localStorage
- Check browser console for CORS errors
- Verify backend auth endpoints with: `curl http://localhost:3001/api/auth/test`

## 📋 Environment Setup

Ensure your `.env` file has these required variables:
```bash
BETTER_AUTH_SECRET=borrower-portal-super-secure-secret-key-minimum-32-characters-long-for-jwt-signing
BETTER_AUTH_URL=http://localhost:3001
RAVENDB_URL=http://localhost:8080
RAVENDB_DATABASE=BorrowerPortal
```

## 🧪 Testing Authentication

### Register a new user:
```bash
curl -X POST http://localhost:3001/api/auth/sign-up/email \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123", "firstName": "Test", "lastName": "User"}'
```

### Login:
```bash
curl -X POST http://localhost:3001/api/auth/sign-in/email \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'
```

## 🔄 Development Workflow

1. Start backend first (`./start-server.sh`)
2. Wait for "Backend server listening at http://localhost:3001"
3. Start frontend (`npm run dev`)
4. Visit http://localhost:5173

**Note**: The backend uses memory storage for auth in development mode. Data will be lost on restart, which is normal for development.