# Bear Code Backend - Quick Start Guide

Get your Bear Code backend up and running in 5 minutes!

## Prerequisites

- Node.js 20+ installed
- MongoDB running (local or cloud)
- Pinecone account (optional for testing)

## Quick Setup

### 1. Install Dependencies

```bash
cd bear-code-backend
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your settings:

```env
# Minimum required configuration
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017
JWT_SECRET=your-super-secret-key-change-this
```

### 3. Start MongoDB (if local)

**Using Docker:**
```bash
docker run -d -p 27017:27017 --name mongodb mongo:7
```

**Or using Docker Compose:**
```bash
docker-compose up -d mongo
```

### 4. Start the Server

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

### 5. Test the API

**Health Check:**
```bash
curl http://localhost:3000/api/v1/health
```

**Register a User:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123",
    "name": "Test User"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123"
  }'
```

Save the `accessToken` from the response!

**Get Profile:**
```bash
curl http://localhost:3000/api/v1/users/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Using Docker (Easiest)

### Full Stack with Docker Compose

```bash
# Start everything (API + MongoDB + Mongo Express)
docker-compose up -d

# View logs
docker-compose logs -f api

# Stop everything
docker-compose down
```

Access:
- API: http://localhost:3000
- Mongo Express: http://localhost:8081 (admin/admin123)

## Using Postman

1. Import `postman_collection.json` into Postman
2. Set `baseUrl` variable to `http://localhost:3000/api/v1`
3. Run "Login" request - it will automatically save the token
4. Try other requests!

## Next Steps

### Enable Pinecone (Semantic Search)

1. Sign up at [pinecone.io](https://www.pinecone.io)
2. Create an index named `bearcode-semantic-search`
3. Add to `.env`:
```env
PINECONE_API_KEY=your-api-key
PINECONE_INDEX_NAME=bearcode-semantic-search
```

### Configure MCP (Model Context Protocol)

The backend is designed to work with MongoDB and Pinecone via MCP. To use MCP tools:

1. Ensure your MCP configuration includes MongoDB and Pinecone servers
2. The services will automatically use MCP when available
3. See `src/services/mongodb.service.ts` and `src/services/pinecone.service.ts`

### Production Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## Common Issues

### MongoDB Connection Error

**Error:** `MongoServerError: connect ECONNREFUSED`

**Solution:**
```bash
# Check if MongoDB is running
docker ps | grep mongo

# Start MongoDB
docker-compose up -d mongo
```

### Port Already in Use

**Error:** `EADDRINUSE: address already in use :::3000`

**Solution:**
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use a different port in .env
PORT=3001
```

### JWT Secret Warning

**Warning:** Using default JWT secret

**Solution:** Always set a strong JWT_SECRET in production:
```bash
# Generate a random secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Development Tips

### Auto-reload on Changes

The dev server uses `tsx watch` for automatic reloading:
```bash
npm run dev
```

### View Logs

Logs are stored in `logs/` directory:
```bash
tail -f logs/combined.log
tail -f logs/error.log
```

### Database Management

**Using Mongo Express:**
- URL: http://localhost:8081
- Username: admin
- Password: admin123

**Using MongoDB Compass:**
- Connection string: `mongodb://localhost:27017`
- Database: `bearcode`

### Testing Endpoints

**Using curl:**
```bash
# Set token variable
TOKEN="your_access_token_here"

# Get balance
curl http://localhost:3000/api/v1/credits/balance \
  -H "Authorization: Bearer $TOKEN"

# Index code
curl -X POST http://localhost:3000/api/v1/search/index \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "function hello() { return \"world\"; }",
    "language": "javascript",
    "metadata": {
      "fileName": "hello.js"
    }
  }'
```

## API Documentation

- Full API docs: [API.md](./API.md)
- Postman collection: `postman_collection.json`
- Interactive docs: Coming soon (Swagger/OpenAPI)

## Project Structure

```
bear-code-backend/
├── src/
│   ├── config/          # Configuration
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Express middleware
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── types/           # TypeScript types
│   ├── utils/           # Utilities
│   ├── app.ts           # Express app setup
│   └── index.ts         # Entry point
├── logs/                # Application logs
├── .env                 # Environment variables
└── package.json         # Dependencies
```

## Support

- 📖 Documentation: [README.md](./README.md)
- 🚀 Deployment: [DEPLOYMENT.md](./DEPLOYMENT.md)
- 🤝 Contributing: [CONTRIBUTING.md](./CONTRIBUTING.md)
- 📝 API Reference: [API.md](./API.md)

## What's Next?

1. ✅ Backend is running
2. 📱 Build a frontend client
3. 🔌 Integrate with Bear Code IDE
4. 🚀 Deploy to production
5. 📊 Add monitoring and analytics

Happy coding! 🐻
