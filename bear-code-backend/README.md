# Bear Code Backend

Backend API for Bear Code - An AI-powered code assistant (rebrand of KiloCode).

## Features

- 🔐 **Authentication & Authorization** - JWT-based auth with refresh tokens
- 👤 **User Management** - Complete user lifecycle management
- 💳 **Credit System** - Usage-based credit system for API operations
- 🔍 **Semantic Search** - Pinecone-powered vector search for code
- 📊 **Usage Analytics** - Track user activity and credit consumption
- 🛡️ **Security** - Rate limiting, helmet, CORS, input validation
- 📝 **Logging** - Winston-based structured logging

## Tech Stack

- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB (via MCP)
- **Vector DB**: Pinecone (via MCP)
- **Authentication**: JWT
- **Validation**: Zod

## Getting Started

### Prerequisites

- Node.js 20+
- MongoDB instance (or MongoDB MCP configured)
- Pinecone account (or Pinecone MCP configured)

### Installation

```bash
npm install
```

### Configuration

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Production

```bash
npm start
```

## API Documentation

### Authentication

#### Register
```
POST /api/v1/auth/register
Body: { email, password, name }
```

#### Login
```
POST /api/v1/auth/login
Body: { email, password }
```

#### Refresh Token
```
POST /api/v1/auth/refresh
Body: { refreshToken }
```

### User Management

#### Get Profile
```
GET /api/v1/users/profile
Headers: { Authorization: Bearer <token> }
```

#### Update Profile
```
PUT /api/v1/users/profile
Headers: { Authorization: Bearer <token> }
Body: { name, email }
```

### Credits

#### Get Balance
```
GET /api/v1/credits/balance
Headers: { Authorization: Bearer <token> }
```

#### Purchase Credits
```
POST /api/v1/credits/purchase
Headers: { Authorization: Bearer <token> }
Body: { amount, paymentMethod }
```

#### Get Transaction History
```
GET /api/v1/credits/transactions
Headers: { Authorization: Bearer <token> }
```

### Semantic Search

#### Index Code
```
POST /api/v1/search/index
Headers: { Authorization: Bearer <token> }
Body: { code, metadata, language }
```

#### Search Code
```
POST /api/v1/search/query
Headers: { Authorization: Bearer <token> }
Body: { query, limit, filters }
```

## Project Structure

```
bear-code-backend/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Express middleware
│   ├── models/          # Data models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── types/           # TypeScript types
│   ├── utils/           # Utility functions
│   └── index.ts         # Entry point
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

## License

MIT
