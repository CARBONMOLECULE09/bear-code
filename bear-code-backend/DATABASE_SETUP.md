# Database Setup Guide

This guide explains how to set up and connect MongoDB and Pinecone databases for Bear Code Backend.

---

## 🎯 Overview

Bear Code Backend uses two databases:
1. **MongoDB** - Primary database for users, credits, documents, and transactions
2. **Pinecone** - Vector database for semantic code search

Both databases are connected via **MCP (Model Context Protocol)**.

---

## ✅ Current Configuration

### MongoDB
- **Connection**: MongoDB Atlas (Cloud)
- **URI**: `mongodb+srv://wiserman:lion-eleven@cluster0.wpyodhl.mongodb.net/`
- **Database**: `bearcode`
- **Status**: ✅ Connected

**Existing Collections:**
- `users` - User accounts
- `projects` - User projects
- `usages` - Usage tracking
- `conversations` - Chat history
- `codeanalyses` - Code analysis results

### Pinecone
- **API Key**: Configured in MCP
- **Environment**: `us-east-1-aws`
- **Status**: ✅ Connected

**Available Indexes:**
- `bearcode-code-embeddings` - For code search (1024 dimensions)
- `bearcode-error-patterns` - For error analysis (1024 dimensions)
- `bearcode-documentation` - For docs search (1024 dimensions)

---

## 🔧 Configuration

### Environment Variables

The `.env` file is already configured with:

```env
# MongoDB
MONGODB_URI=mongodb+srv://wiserman:lion-eleven@cluster0.wpyodhl.mongodb.net/?appName=Cluster0
MONGODB_DATABASE=bearcode

# Pinecone
PINECONE_API_KEY=pcsk_3mejDT_2jFwgj35unrHsBqy6qNsiadH8GmVDBjWwnPgepoqfNrevBDXPQLE3Pj9EbxmRVn
PINECONE_INDEX_NAME=bearcode-code-embeddings
```

### MCP Configuration

MCP is configured in `~/.kiro/settings/mcp.json`:

```json
{
  "mcpServers": {
    "MongoDB": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "mongodb-mcp-server@latest"],
      "env": {
        "MDB_MCP_CONNECTION_STRING": "mongodb+srv://..."
      }
    },
    "pinecone": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@pinecone-database/mcp"],
      "env": {
        "PINECONE_API_KEY": "pcsk_..."
      }
    }
  }
}
```

---

## 🧪 Testing Connections

### Quick Test

```bash
npm run test:db
```

This will:
- ✅ Connect to MongoDB
- ✅ List collections and stats
- ✅ Connect to Pinecone
- ✅ Show index stats
- ✅ Display connection summary

### Manual Test

```bash
# Start the server
npm run dev

# Check logs for:
# ✅ MongoDB connected successfully
# ✅ Pinecone initialized successfully
```

---

## 📊 Database Schema

### MongoDB Collections

#### users
```javascript
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

#### credit_transactions
```javascript
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

#### code_documents
```javascript
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

#### search_queries
```javascript
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

### Pinecone Indexes

#### bearcode-code-embeddings
- **Purpose**: Semantic code search
- **Dimension**: 1024
- **Model**: multilingual-e5-large
- **Field Map**: `code` → embeddings

**Record Structure:**
```javascript
{
  id: string,
  code: string,
  userId: string,
  language: string,
  fileName: string,
  projectName: string,
  tags: string[]
}
```

---

## 🚀 Usage Examples

### MongoDB Operations

```typescript
import { mongoDBService } from './services/mongodb.service';

// Create user
const user = await mongoDBService.createUser({
  email: 'user@example.com',
  password: 'hashed_password',
  name: 'John Doe',
  credits: 100,
  role: 'user',
  isActive: true,
  emailVerified: false
});

// Find user
const user = await mongoDBService.findUserByEmail('user@example.com');

// Update credits
const newBalance = await mongoDBService.updateUserCredits(userId, -5);
```

### Pinecone Operations

```typescript
import { pineconeService } from './services/pinecone.service';

// Index code
await pineconeService.indexCode({
  id: 'doc-123',
  text: 'function hello() { return "world"; }',
  metadata: {
    userId: 'user-456',
    language: 'javascript',
    fileName: 'hello.js'
  }
});

// Search code
const results = await pineconeService.searchCode(
  'function that returns hello world',
  'user-456',
  10
);
```

---

## 🔍 Monitoring

### MongoDB

**View in MongoDB Compass:**
1. Download [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Connect with URI: `mongodb+srv://wiserman:lion-eleven@cluster0.wpyodhl.mongodb.net/`
3. Select database: `bearcode`

**View in MongoDB Atlas:**
1. Visit [cloud.mongodb.com](https://cloud.mongodb.com)
2. Login with credentials
3. Navigate to Cluster0 → Collections

### Pinecone

**View in Pinecone Console:**
1. Visit [app.pinecone.io](https://app.pinecone.io)
2. Login with credentials
3. View indexes and stats

**Check via API:**
```bash
npm run test:db
```

---

## 🛠️ Maintenance

### MongoDB

**Backup:**
```bash
mongodump --uri="mongodb+srv://..." --out=./backup
```

**Restore:**
```bash
mongorestore --uri="mongodb+srv://..." ./backup
```

**Create Indexes:**
```javascript
// Automatically created on startup
// See: src/services/mongodb.service.ts
```

### Pinecone

**Clear Namespace:**
```typescript
// Delete all vectors in a namespace
await pineconeService.deleteCode(vectorId, userId);
```

**View Stats:**
```bash
npm run test:db
```

---

## 🐛 Troubleshooting

### MongoDB Connection Issues

**Problem:** `MongoServerError: Authentication failed`

**Solution:**
1. Check credentials in `.env`
2. Verify IP whitelist in MongoDB Atlas
3. Check network connectivity

**Problem:** `MongoServerError: connect ETIMEDOUT`

**Solution:**
1. Check internet connection
2. Verify MongoDB Atlas is accessible
3. Check firewall settings

### Pinecone Connection Issues

**Problem:** `Pinecone initialization failed`

**Solution:**
1. Verify API key in `.env`
2. Check index name is correct
3. Ensure index exists in Pinecone console

**Problem:** `Index not found`

**Solution:**
1. Create index in Pinecone console
2. Or use: `bearcode-code-embeddings` (already exists)

---

## 📝 Adding New Collections

### MongoDB

```typescript
// In mongodb.service.ts
async createNewCollection(name: string) {
  const db = this.getDb();
  await db.createCollection(name);
  
  // Add indexes
  await db.collection(name).createIndex({ userId: 1 });
}
```

### Pinecone

```typescript
// Create new index via Pinecone console or MCP
// Then update config:
PINECONE_INDEX_NAME=your-new-index
```

---

## 🔐 Security

### MongoDB
- ✅ Connection string uses TLS/SSL
- ✅ Authentication enabled
- ✅ IP whitelist configured
- ✅ Database user has limited permissions

### Pinecone
- ✅ API key stored in environment variables
- ✅ Namespaces isolate user data
- ✅ HTTPS for all API calls

---

## 📊 Performance

### MongoDB
- Connection pooling enabled
- Indexes on frequently queried fields
- Efficient query patterns

### Pinecone
- Serverless architecture
- Auto-scaling
- Low latency search (<100ms)

---

## 🎯 Next Steps

1. ✅ Databases are connected
2. ✅ Collections are ready
3. ✅ Indexes are configured
4. 🔄 Start using the API
5. 📊 Monitor usage
6. 🚀 Scale as needed

---

## 📞 Support

- MongoDB Issues: Check MongoDB Atlas dashboard
- Pinecone Issues: Check Pinecone console
- Backend Issues: Check application logs in `logs/`

---

**Databases are ready! Start the server with `npm run dev`** 🚀
