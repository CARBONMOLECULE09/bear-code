# 🐻 Getting Started with Bear Code Backend

Welcome! This guide will get you up and running in **5 minutes**.

---

## 🎯 What You're Building With

A complete backend API featuring:
- ✅ JWT Authentication
- ✅ User Management  
- ✅ Credit System
- ✅ Semantic Search (Pinecone)
- ✅ MongoDB Integration
- ✅ Production-Ready Security

---

## ⚡ Quick Start (5 Minutes)

### Step 1: Install Dependencies (1 min)

```bash
cd bear-code-backend
npm install
```

### Step 2: Configure Environment (1 min)

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your settings (or use defaults for local dev)
```

**Minimum configuration for local development:**
```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017
JWT_SECRET=your-secret-key-here
```

### Step 3: Start MongoDB (1 min)

**Option A: Using Docker (Recommended)**
```bash
docker run -d -p 27017:27017 --name mongodb mongo:7
```

**Option B: Using Docker Compose**
```bash
docker-compose up -d mongo
```

**Option C: Use MongoDB Atlas (Cloud)**
- Sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
- Get connection string
- Update `MONGODB_URI` in `.env`

### Step 4: Start the Server (1 min)

```bash
npm run dev
```

You should see:
```
🐻 Bear Code API running on port 3000
Environment: development
API Version: v1
Health check: http://localhost:3000/api/v1/health
```

### Step 5: Test the API (1 min)

**Quick Test:**
```bash
curl http://localhost:3000/api/v1/health
```

**Full Test Suite:**
```bash
chmod +x scripts/test-api.sh
./scripts/test-api.sh
```

---

## 🎉 You're Done!

Your backend is now running at `http://localhost:3000`

---

## 🚀 What's Next?

### Test with Postman

1. Import `postman_collection.json` into Postman
2. Set `baseUrl` to `http://localhost:3000/api/v1`
3. Run the "Login" request
4. Token is automatically saved
5. Try other endpoints!

### Create Your First User

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123",
    "name": "Test User"
  }'
```

Save the `accessToken` from the response!

### Check Your Credits

```bash
curl http://localhost:3000/api/v1/credits/balance \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Index Some Code

```bash
curl -X POST http://localhost:3000/api/v1/search/index \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "function hello() { return \"world\"; }",
    "language": "javascript",
    "metadata": {
      "fileName": "hello.js"
    }
  }'
```

---

## 📚 Learn More

### Documentation
- **API Reference**: [API.md](./API.md) - Complete endpoint documentation
- **Architecture**: [ARCHITECTURE.md](./ARCHITECTURE.md) - System design
- **Deployment**: [DEPLOYMENT.md](./DEPLOYMENT.md) - Production deployment
- **Contributing**: [CONTRIBUTING.md](./CONTRIBUTING.md) - Development guide

### Key Concepts

#### Authentication
All protected endpoints require a Bearer token:
```
Authorization: Bearer <your_access_token>
```

#### Credits
- New users get 100 free credits
- Index code: 1 credit
- Search code: 2 credits
- Purchase more via `/credits/purchase`

#### Rate Limits
- General API: 100 req/15min
- Auth endpoints: 5 req/15min  
- Search: 20 req/min

---

## 🐛 Troubleshooting

### MongoDB Connection Error

**Problem:** `MongoServerError: connect ECONNREFUSED`

**Solution:**
```bash
# Check if MongoDB is running
docker ps | grep mongo

# Start MongoDB
docker run -d -p 27017:27017 --name mongodb mongo:7
```

### Port Already in Use

**Problem:** `EADDRINUSE: address already in use :::3000`

**Solution:**
```bash
# Find process using port 3000
lsof -i :3000

# Kill it
kill -9 <PID>

# Or use different port in .env
PORT=3001
```

### JWT Secret Warning

**Problem:** Using default JWT secret

**Solution:**
```bash
# Generate secure secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Add to .env
JWT_SECRET=<generated_secret>
```

---

## 🎓 Common Tasks

### View Logs

```bash
# Real-time logs
tail -f logs/combined.log

# Error logs only
tail -f logs/error.log
```

### Restart Server

```bash
# Development (auto-restarts on changes)
npm run dev

# Production
npm run build
npm start
```

### Database Management

**Using Mongo Express (Web UI):**
```bash
docker-compose up -d mongo-express
# Visit: http://localhost:8081
# Login: admin / admin123
```

**Using MongoDB Compass:**
- Download from [mongodb.com/products/compass](https://www.mongodb.com/products/compass)
- Connect to: `mongodb://localhost:27017`
- Database: `bearcode`

---

## 🔧 Development Tips

### Hot Reload
The dev server automatically reloads on file changes:
```bash
npm run dev
```

### Code Formatting
```bash
npm run format
```

### Type Checking
```bash
npm run check-types
```

### Build for Production
```bash
npm run build
# Output in dist/
```

---

## 🌟 Features Overview

### ✅ Implemented
- User registration & login
- JWT authentication
- Credit system
- Code indexing
- Semantic search
- Transaction history
- User statistics
- Rate limiting
- Input validation
- Error handling
- Logging

### 🔜 Coming Soon
- Email verification
- Password reset
- OAuth (GitHub, Google)
- Payment integration
- WebSocket support
- Team features
- Analytics dashboard

---

## 📞 Need Help?

### Resources
- 📖 **Full Documentation**: See all `.md` files
- 🔍 **API Reference**: [API.md](./API.md)
- 🏗️ **Architecture**: [ARCHITECTURE.md](./ARCHITECTURE.md)
- 🚀 **Deployment**: [DEPLOYMENT.md](./DEPLOYMENT.md)

### Support Channels
- 💬 GitHub Issues
- 📧 Email support
- 💭 Community Discord

---

## 🎯 Quick Reference

### Essential Commands
```bash
npm install          # Install dependencies
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run format       # Format code
npm run lint         # Lint code
```

### Essential Endpoints
```bash
POST   /api/v1/auth/register      # Register
POST   /api/v1/auth/login         # Login
GET    /api/v1/users/profile      # Get profile
GET    /api/v1/credits/balance    # Check credits
POST   /api/v1/search/index       # Index code
POST   /api/v1/search/query       # Search code
GET    /api/v1/health             # Health check
```

### Essential Files
```
.env                 # Configuration
src/index.ts         # Entry point
src/app.ts           # Express setup
logs/combined.log    # Application logs
```

---

## 🎉 Success!

You now have a fully functional backend API running locally!

**What you can do:**
- ✅ Register users
- ✅ Authenticate with JWT
- ✅ Manage credits
- ✅ Index code
- ✅ Search semantically
- ✅ Track usage

**Next steps:**
1. Explore the API with Postman
2. Read the full documentation
3. Deploy to production
4. Integrate with Bear Code IDE

---

**Happy Coding! 🐻**

*Built with ❤️ for the Bear Code community*
