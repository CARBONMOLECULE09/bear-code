# 🐻 Bear Code

**AI-Powered Code Assistant** - A complete full-stack application for semantic code search and management.

> Rebrand of KiloCode with enhanced features and modern architecture.

---

## 🚀 Features

### Backend
- ✅ **Authentication** - JWT-based auth with refresh tokens
- ✅ **User Management** - Complete user lifecycle
- ✅ **Credit System** - Usage-based billing
- ✅ **Semantic Search** - Pinecone-powered vector search
- ✅ **MongoDB Integration** - User data and transactions
- ✅ **Security** - Rate limiting, validation, encryption

### Frontend
- ✅ **Modern UI** - React + TypeScript + Tailwind CSS
- ✅ **Dashboard** - Statistics and quick actions
- ✅ **Code Search** - Natural language search interface
- ✅ **Credit Management** - Purchase and track usage
- ✅ **Profile Management** - User settings and preferences
- ✅ **Responsive Design** - Mobile, tablet, and desktop

---

## 📦 Project Structure

```
bear-code/
├── bear-code-backend/     # Node.js + Express + TypeScript
│   ├── src/
│   │   ├── controllers/   # Request handlers
│   │   ├── services/      # Business logic
│   │   ├── middleware/    # Express middleware
│   │   ├── routes/        # API routes
│   │   ├── types/         # TypeScript types
│   │   └── utils/         # Utilities
│   ├── scripts/           # Setup and test scripts
│   └── logs/              # Application logs
│
├── bear-code-frontend/    # React + TypeScript + Tailwind
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── contexts/      # React contexts
│   │   ├── services/      # API client
│   │   └── types/         # TypeScript types
│   └── public/            # Static assets
│
└── kilocode/              # Reference implementation
```

---

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB (Atlas)
- **Vector DB**: Pinecone
- **Auth**: JWT
- **Validation**: Zod

### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **HTTP**: Axios
- **Notifications**: React Hot Toast

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- MongoDB (Atlas account or local)
- Pinecone account

### 1. Clone Repository
```bash
git clone https://github.com/CARBONMOLECULE09/bear-code.git
cd bear-code
```

### 2. Setup Backend
```bash
cd bear-code-backend
npm install
cp .env.example .env
# Edit .env with your credentials
npm run dev
```

Backend runs on `http://localhost:3000`

### 3. Setup Frontend
```bash
cd bear-code-frontend
npm install
npm start
```

Frontend runs on `http://localhost:3001`

### 4. Create Account
- Visit `http://localhost:3001`
- Click "Sign up"
- Get 100 free credits!

---

## 📚 Documentation

### Backend
- [README](./bear-code-backend/README.md) - Main documentation
- [API Documentation](./bear-code-backend/API.md) - Complete API reference
- [Architecture](./bear-code-backend/ARCHITECTURE.md) - System design
- [Deployment](./bear-code-backend/DEPLOYMENT.md) - Deployment guide
- [Database Setup](./bear-code-backend/DATABASE_SETUP.md) - Database configuration
- [Quick Start](./bear-code-backend/QUICKSTART.md) - 5-minute setup

### Frontend
- [README](./bear-code-frontend/README.md) - Main documentation
- [Frontend Summary](./bear-code-frontend/FRONTEND_SUMMARY.md) - Complete overview
- [Quick Start](./bear-code-frontend/QUICKSTART.md) - 2-minute setup

---

## 🔧 Configuration

### Backend (.env)
```env
NODE_ENV=development
PORT=3000
MONGODB_URI=your-mongodb-uri
JWT_SECRET=your-secret-key
PINECONE_API_KEY=your-pinecone-key
PINECONE_INDEX_NAME=bearcode-code-embeddings
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:3000/api/v1
```

---

## 🎯 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/refresh` - Refresh token

### Users
- `GET /api/v1/users/profile` - Get profile
- `PUT /api/v1/users/profile` - Update profile
- `GET /api/v1/users/stats` - Get statistics

### Credits
- `GET /api/v1/credits/balance` - Get balance
- `POST /api/v1/credits/purchase` - Purchase credits
- `GET /api/v1/credits/transactions` - Transaction history

### Search
- `POST /api/v1/search/index` - Index code
- `POST /api/v1/search/query` - Search code
- `GET /api/v1/search/documents` - List documents

---

## 💳 Credit Costs

- **Index Code**: 1 credit per document
- **Search Code**: 2 credits per search
- **Default Credits**: 100 (on registration)

---

## 🔐 Security Features

- JWT authentication with refresh tokens
- Password hashing with bcrypt
- Rate limiting (general, auth, search)
- Input validation with Zod
- CORS protection
- Helmet security headers
- XSS protection

---

## 🗄️ Database Schema

### MongoDB Collections
- `users` - User accounts and profiles
- `credit_transactions` - Credit transaction history
- `code_documents` - Indexed code documents
- `search_queries` - Search query logs

### Pinecone Indexes
- `bearcode-code-embeddings` - Code vector embeddings (1024 dim)
- `bearcode-error-patterns` - Error pattern vectors
- `bearcode-documentation` - Documentation vectors

---

## 🚀 Deployment

### Backend
- Docker support included
- Deploy to AWS, Vercel, Railway, or Render
- See [DEPLOYMENT.md](./bear-code-backend/DEPLOYMENT.md)

### Frontend
- Build: `npm run build`
- Deploy to Vercel, Netlify, or any static host
- Supports environment variables

---

## 🧪 Testing

### Backend
```bash
cd bear-code-backend
npm run test:db          # Test database connections
./scripts/test-api.sh    # Test API endpoints
```

### Frontend
```bash
cd bear-code-frontend
npm test                 # Run tests
```

---

## 📊 Project Status

- ✅ Backend: Complete and production-ready
- ✅ Frontend: Complete and production-ready
- ✅ Databases: Connected (MongoDB + Pinecone)
- ✅ Authentication: Fully implemented
- ✅ Documentation: Comprehensive
- ✅ Security: Best practices implemented

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

See [CONTRIBUTING.md](./bear-code-backend/CONTRIBUTING.md) for guidelines.

---

## 📝 License

MIT License - See [LICENSE](./bear-code-backend/LICENSE) for details.

---

## 🙏 Acknowledgments

- Built on top of [KiloCode](https://github.com/Kilo-Org/kilocode)
- Uses MongoDB MCP and Pinecone MCP
- Inspired by modern AI code assistants

---

## 📞 Support

- 📖 Documentation: See all `.md` files
- 🐛 Issues: [GitHub Issues](https://github.com/CARBONMOLECULE09/bear-code/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/CARBONMOLECULE09/bear-code/discussions)

---

## 🎯 Roadmap

### Phase 1 (Complete) ✅
- [x] Backend API
- [x] Frontend UI
- [x] Authentication
- [x] Credit system
- [x] Semantic search
- [x] Documentation

### Phase 2 (Planned)
- [ ] Code generation
- [ ] Team collaboration
- [ ] OAuth integration
- [ ] Payment processing
- [ ] Advanced analytics
- [ ] Mobile app

### Phase 3 (Future)
- [ ] VS Code extension
- [ ] JetBrains plugin
- [ ] API marketplace
- [ ] Enterprise features

---

## 📈 Stats

- **Backend**: 40+ files, 3,500+ lines of code
- **Frontend**: 20+ files, 2,500+ lines of code
- **Documentation**: 15+ comprehensive guides
- **API Endpoints**: 16 fully functional endpoints
- **Pages**: 6 complete React pages

---

**Built with ❤️ for developers by developers**

🐻 **Bear Code** - Your AI-powered coding companion

---

## 🚀 Get Started Now!

```bash
# Clone the repo
git clone https://github.com/CARBONMOLECULE09/bear-code.git

# Start backend
cd bear-code/bear-code-backend
npm install && npm run dev

# Start frontend (new terminal)
cd bear-code/bear-code-frontend
npm install && npm start

# Visit http://localhost:3001
```

**Happy Coding!** 🎉
