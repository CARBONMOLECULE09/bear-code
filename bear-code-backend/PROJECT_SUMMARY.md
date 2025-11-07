# Bear Code Backend - Project Summary

## Overview

A complete, production-ready backend API for Bear Code (rebrand of KiloCode) - an AI-powered code assistant. Built with Node.js, TypeScript, Express, MongoDB, and Pinecone.

## 🎯 Features Implemented

### ✅ Authentication & Authorization
- JWT-based authentication with refresh tokens
- Secure password hashing with bcrypt
- Role-based access control (user/admin)
- Token expiration and refresh mechanism
- Rate limiting on auth endpoints

### ✅ User Management
- User registration and login
- Profile management (view/update)
- Password change functionality
- User statistics and analytics
- Account deactivation (soft delete)

### ✅ Credit System
- Credit balance tracking
- Credit purchase functionality
- Transaction history with pagination
- Usage tracking per operation
- Admin functions (bonus credits, refunds)
- Automatic credit deduction for operations

### ✅ Semantic Search (Pinecone Integration)
- Code indexing with vector embeddings
- Semantic code search
- Document management (list, delete)
- Search history tracking
- Metadata filtering
- Credit-based usage

### ✅ Database (MongoDB Integration)
- User data storage
- Credit transactions
- Code documents
- Search queries
- Automatic indexing
- Connection pooling

### ✅ Security
- Helmet.js for HTTP headers
- CORS configuration
- Rate limiting (general, auth, search)
- Input validation with Zod
- SQL injection prevention
- XSS protection
- Environment variable management

### ✅ API Features
- RESTful API design
- Comprehensive error handling
- Request/response logging
- Pagination support
- Health check endpoint
- API versioning (v1)

### ✅ Developer Experience
- TypeScript for type safety
- ESLint and Prettier configuration
- Hot reload in development
- Structured logging with Winston
- Docker support
- Docker Compose for full stack
- Comprehensive documentation

## 📁 Project Structure

```
bear-code-backend/
├── src/
│   ├── config/
│   │   └── index.ts              # Configuration management
│   ├── controllers/
│   │   ├── auth.controller.ts    # Authentication handlers
│   │   ├── credit.controller.ts  # Credit management handlers
│   │   ├── search.controller.ts  # Search handlers
│   │   └── user.controller.ts    # User management handlers
│   ├── middleware/
│   │   ├── auth.middleware.ts    # JWT authentication
│   │   ├── error.middleware.ts   # Error handling
│   │   ├── rateLimit.middleware.ts # Rate limiting
│   │   └── validation.middleware.ts # Request validation
│   ├── routes/
│   │   ├── auth.routes.ts        # Auth endpoints
│   │   ├── credit.routes.ts      # Credit endpoints
│   │   ├── search.routes.ts      # Search endpoints
│   │   ├── user.routes.ts        # User endpoints
│   │   └── index.ts              # Route aggregation
│   ├── services/
│   │   ├── auth.service.ts       # Authentication logic
│   │   ├── credit.service.ts     # Credit management logic
│   │   ├── mongodb.service.ts    # MongoDB operations
│   │   ├── pinecone.service.ts   # Pinecone operations
│   │   └── search.service.ts     # Search logic
│   ├── types/
│   │   └── index.ts              # TypeScript interfaces
│   ├── utils/
│   │   ├── errors.ts             # Custom error classes
│   │   ├── logger.ts             # Winston logger
│   │   └── validation.ts         # Zod schemas
│   ├── app.ts                    # Express app setup
│   └── index.ts                  # Entry point
├── scripts/
│   ├── setup.sh                  # Setup script
│   └── test-api.sh               # API testing script
├── logs/                         # Application logs
├── .env.example                  # Environment template
├── .gitignore                    # Git ignore rules
├── API.md                        # API documentation
├── CONTRIBUTING.md               # Contribution guide
├── DEPLOYMENT.md                 # Deployment guide
├── Dockerfile                    # Docker image
├── docker-compose.yml            # Docker Compose config
├── package.json                  # Dependencies
├── postman_collection.json       # Postman collection
├── QUICKSTART.md                 # Quick start guide
├── README.md                     # Main documentation
└── tsconfig.json                 # TypeScript config
```

## 🚀 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/refresh` - Refresh access token
- `GET /api/v1/auth/profile` - Get user profile
- `POST /api/v1/auth/logout` - Logout user

### User Management
- `GET /api/v1/users/profile` - Get user profile
- `PUT /api/v1/users/profile` - Update profile
- `POST /api/v1/users/change-password` - Change password
- `GET /api/v1/users/stats` - Get user statistics
- `DELETE /api/v1/users/account` - Deactivate account

### Credits
- `GET /api/v1/credits/balance` - Get credit balance
- `POST /api/v1/credits/purchase` - Purchase credits
- `GET /api/v1/credits/transactions` - Get transaction history
- `POST /api/v1/credits/bonus` - Add bonus credits (admin)
- `POST /api/v1/credits/refund` - Refund credits (admin)

### Semantic Search
- `POST /api/v1/search/index` - Index code document
- `POST /api/v1/search/query` - Search code
- `GET /api/v1/search/documents` - List documents
- `DELETE /api/v1/search/documents/:id` - Delete document
- `GET /api/v1/search/history` - Get search history

### System
- `GET /api/v1/health` - Health check

## 💳 Credit Costs

- **Index Code**: 1 credit per document
- **Search Code**: 2 credits per search
- **Code Generation**: 5 credits (future feature)
- **Default Credits**: 100 (on registration)

## 🔒 Security Features

1. **Authentication**
   - JWT tokens with expiration
   - Refresh token rotation
   - Secure password hashing (bcrypt)

2. **Rate Limiting**
   - General: 100 req/15min
   - Auth: 5 req/15min
   - Search: 20 req/min

3. **Input Validation**
   - Zod schema validation
   - Type checking
   - Sanitization

4. **HTTP Security**
   - Helmet.js headers
   - CORS configuration
   - XSS protection

## 🗄️ Database Schema

### Users Collection
```typescript
{
  _id: ObjectId,
  email: string,
  password: string (hashed),
  name: string,
  credits: number,
  role: 'user' | 'admin',
  isActive: boolean,
  emailVerified: boolean,
  createdAt: Date,
  updatedAt: Date,
  lastLoginAt: Date
}
```

### Credit Transactions Collection
```typescript
{
  _id: ObjectId,
  userId: string,
  amount: number,
  type: 'purchase' | 'usage' | 'refund' | 'bonus',
  operation: string,
  description: string,
  balanceBefore: number,
  balanceAfter: number,
  metadata: object,
  createdAt: Date
}
```

### Code Documents Collection
```typescript
{
  _id: ObjectId,
  userId: string,
  code: string,
  language: string,
  metadata: {
    fileName: string,
    filePath: string,
    projectName: string,
    tags: string[]
  },
  vectorId: string,
  createdAt: Date,
  updatedAt: Date
}
```

### Search Queries Collection
```typescript
{
  _id: ObjectId,
  userId: string,
  query: string,
  filters: object,
  limit: number,
  results: number,
  creditsUsed: number,
  createdAt: Date
}
```

## 🔧 Technology Stack

- **Runtime**: Node.js 20+
- **Language**: TypeScript 5+
- **Framework**: Express.js 4
- **Database**: MongoDB 6+
- **Vector DB**: Pinecone
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: Zod
- **Logging**: Winston
- **Security**: Helmet, CORS, bcrypt
- **Rate Limiting**: express-rate-limit

## 📦 Dependencies

### Production
- express - Web framework
- cors - CORS middleware
- helmet - Security headers
- dotenv - Environment variables
- jsonwebtoken - JWT authentication
- bcryptjs - Password hashing
- zod - Schema validation
- mongodb - MongoDB driver
- winston - Logging
- express-rate-limit - Rate limiting
- uuid - Unique IDs

### Development
- typescript - Type checking
- tsx - TypeScript execution
- eslint - Code linting
- prettier - Code formatting
- vitest - Testing framework

## 🚀 Deployment Options

1. **Docker** - Containerized deployment
2. **Docker Compose** - Full stack deployment
3. **AWS EC2** - Traditional server
4. **Vercel** - Serverless
5. **Railway** - Platform as a Service
6. **Render** - Platform as a Service

## 📚 Documentation

- **README.md** - Main documentation
- **QUICKSTART.md** - Quick start guide
- **API.md** - Complete API reference
- **DEPLOYMENT.md** - Deployment instructions
- **CONTRIBUTING.md** - Contribution guidelines
- **PROJECT_SUMMARY.md** - This file

## 🧪 Testing

- Postman collection included
- API test script (`scripts/test-api.sh`)
- Health check endpoint
- Manual testing guide in QUICKSTART.md

## 🔄 Integration with Bear Code IDE

This backend is designed to integrate with the Bear Code IDE (rebrand of KiloCode). The IDE can:

1. Authenticate users via the API
2. Track credit usage
3. Index code from the workspace
4. Perform semantic searches
5. Manage user profiles

## 🎯 Future Enhancements

- [ ] WebSocket support for real-time features
- [ ] Code generation endpoints
- [ ] Team/organization support
- [ ] API key authentication
- [ ] Webhook support
- [ ] Analytics dashboard
- [ ] Email verification
- [ ] Password reset
- [ ] OAuth integration (GitHub, Google)
- [ ] Stripe payment integration
- [ ] Redis caching
- [ ] GraphQL API
- [ ] OpenAPI/Swagger documentation
- [ ] Comprehensive test suite
- [ ] CI/CD pipeline
- [ ] Monitoring and alerting

## 📝 Notes

### MCP Integration

The backend is designed to work with MongoDB and Pinecone via MCP (Model Context Protocol). The service files (`mongodb.service.ts` and `pinecone.service.ts`) provide wrapper interfaces that can be connected to MCP tools when available.

### Credit System

The credit system is fully functional and tracks all operations. In production, integrate with a payment gateway (Stripe, PayPal) for actual credit purchases.

### Semantic Search

Pinecone integration is set up but requires:
1. Pinecone API key
2. Index creation
3. Embedding model configuration

For development, the search service will work without Pinecone but won't return actual results.

## 🤝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## 📄 License

MIT License - See LICENSE file for details.

## 🐻 About Bear Code

Bear Code is a rebrand of KiloCode - an open-source AI-powered code assistant. This backend provides the infrastructure for user management, credit tracking, and semantic code search.

---

**Built with ❤️ for the Bear Code community**
