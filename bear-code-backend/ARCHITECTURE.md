# Bear Code Backend Architecture

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Bear Code IDE                            │
│                    (Frontend/VS Code Extension)                  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTP/REST API
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                      Express.js Server                           │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    Middleware Layer                       │  │
│  │  • Authentication (JWT)                                   │  │
│  │  • Rate Limiting                                          │  │
│  │  • Validation (Zod)                                       │  │
│  │  • Error Handling                                         │  │
│  │  • Logging (Winston)                                      │  │
│  └──────────────────────────────────────────────────────────┘  │
│                             │                                    │
│  ┌──────────────────────────▼────────────────────────────────┐ │
│  │                    Route Layer                            │ │
│  │  • /auth    - Authentication                              │ │
│  │  • /users   - User Management                             │ │
│  │  • /credits - Credit System                               │ │
│  │  • /search  - Semantic Search                             │ │
│  └──────────────────────────────────────────────────────────┘ │
│                             │                                    │
│  ┌──────────────────────────▼────────────────────────────────┐ │
│  │                  Controller Layer                         │ │
│  │  • Request Handling                                       │ │
│  │  • Response Formatting                                    │ │
│  │  • Input Validation                                       │ │
│  └──────────────────────────────────────────────────────────┘ │
│                             │                                    │
│  ┌──────────────────────────▼────────────────────────────────┐ │
│  │                   Service Layer                           │ │
│  │  • Business Logic                                         │ │
│  │  • Data Processing                                        │ │
│  │  • External API Calls                                     │ │
│  └──────────────────────────────────────────────────────────┘ │
└────────────────────────────┬────────────────────────────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│   MongoDB     │   │   Pinecone    │   │  MCP Server   │
│               │   │               │   │               │
│ • Users       │   │ • Vectors     │   │ • Tools       │
│ • Credits     │   │ • Embeddings  │   │ • Resources   │
│ • Documents   │   │ • Search      │   │ • Prompts     │
│ • Queries     │   │               │   │               │
└───────────────┘   └───────────────┘   └───────────────┘
```

## Request Flow

### Authentication Flow

```
User Request
    │
    ▼
┌─────────────────┐
│  POST /login    │
└────────┬────────┘
         │
         ▼
┌─────────────────────┐
│  Auth Controller    │
│  • Validate input   │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│   Auth Service      │
│  • Find user        │
│  • Verify password  │
│  • Generate tokens  │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│  MongoDB Service    │
│  • Query user       │
│  • Update login     │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│   Response          │
│  • User profile     │
│  • Access token     │
│  • Refresh token    │
└─────────────────────┘
```

### Search Flow

```
Authenticated Request
    │
    ▼
┌─────────────────────┐
│ POST /search/query  │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│ Auth Middleware     │
│ • Verify JWT        │
│ • Extract user      │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│ Search Controller   │
│ • Validate query    │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│ Credit Service      │
│ • Check balance     │
│ • Deduct credits    │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│ Search Service      │
│ • Process query     │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│ Pinecone Service    │
│ • Vector search     │
│ • Get results       │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│ MongoDB Service     │
│ • Fetch documents   │
│ • Log query         │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│ Response            │
│ • Search results    │
│ • Credits used      │
└─────────────────────┘
```

## Component Responsibilities

### Controllers
- Handle HTTP requests/responses
- Validate request data
- Call appropriate services
- Format responses
- Handle errors

### Services
- Implement business logic
- Interact with databases
- Process data
- Manage transactions
- Handle external APIs

### Middleware
- **Authentication**: Verify JWT tokens
- **Authorization**: Check user permissions
- **Rate Limiting**: Prevent abuse
- **Validation**: Validate request data
- **Error Handling**: Catch and format errors
- **Logging**: Log requests and errors

### Database Layer
- **MongoDB Service**: User data, transactions, documents
- **Pinecone Service**: Vector embeddings, semantic search

## Data Flow

### User Registration
```
1. Client sends registration data
2. Validation middleware checks input
3. Auth controller receives request
4. Auth service:
   - Hashes password
   - Creates user in MongoDB
   - Generates JWT tokens
   - Creates welcome credit transaction
5. Response sent to client
```

### Code Indexing
```
1. Client sends code + metadata
2. Auth middleware verifies token
3. Search controller validates input
4. Credit service deducts credits
5. Search service:
   - Stores document in MongoDB
   - Generates vector embedding
   - Indexes in Pinecone
6. Response sent to client
```

### Semantic Search
```
1. Client sends search query
2. Auth middleware verifies token
3. Rate limiter checks limits
4. Search controller validates query
5. Credit service deducts credits
6. Search service:
   - Queries Pinecone for similar vectors
   - Fetches full documents from MongoDB
   - Logs search query
7. Results sent to client
```

## Security Layers

```
┌─────────────────────────────────────┐
│         Rate Limiting               │
│  • Prevent brute force              │
│  • Limit API abuse                  │
└────────────┬────────────────────────┘
             │
┌────────────▼────────────────────────┐
│         Authentication              │
│  • JWT verification                 │
│  • Token expiration                 │
└────────────┬────────────────────────┘
             │
┌────────────▼────────────────────────┐
│         Authorization               │
│  • Role-based access                │
│  • Resource ownership               │
└────────────┬────────────────────────┘
             │
┌────────────▼────────────────────────┐
│         Input Validation            │
│  • Schema validation (Zod)          │
│  • Type checking                    │
│  • Sanitization                     │
└────────────┬────────────────────────┘
             │
┌────────────▼────────────────────────┐
│         Business Logic              │
│  • Credit checks                    │
│  • Data processing                  │
└─────────────────────────────────────┘
```

## Scalability Considerations

### Horizontal Scaling
```
┌──────────────┐
│ Load Balancer│
└──────┬───────┘
       │
   ┌───┴───┬───────┬───────┐
   │       │       │       │
   ▼       ▼       ▼       ▼
┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐
│ API │ │ API │ │ API │ │ API │
│  1  │ │  2  │ │  3  │ │  4  │
└──┬──┘ └──┬──┘ └──┬──┘ └──┬──┘
   │       │       │       │
   └───┬───┴───┬───┴───┬───┘
       │       │       │
       ▼       ▼       ▼
   ┌─────────────────────┐
   │   MongoDB Cluster   │
   │   (Replica Set)     │
   └─────────────────────┘
```

### Caching Strategy
```
Client Request
    │
    ▼
┌─────────┐
│  Redis  │ ◄── Cache frequently accessed data
│  Cache  │     • User profiles
└────┬────┘     • Credit balances
     │          • Search results
     │ Cache Miss
     ▼
┌─────────┐
│ MongoDB │
└─────────┘
```

## Error Handling Flow

```
Error Occurs
    │
    ▼
┌──────────────────┐
│ Is AppError?     │
├──────────────────┤
│ Yes │ No         │
│     │            │
│     ▼            ▼
│  Known    Unknown
│  Error     Error
│     │            │
│     ▼            ▼
│  Format    Log &
│  Response  Format
│     │            │
│     └────┬───────┘
│          │
│          ▼
│    ┌──────────┐
│    │ Logger   │
│    └──────────┘
│          │
│          ▼
│    ┌──────────┐
│    │ Response │
│    └──────────┘
```

## Monitoring & Logging

```
┌─────────────────────────────────────┐
│         Application Logs            │
│  • Winston Logger                   │
│  • File: logs/combined.log          │
│  • File: logs/error.log             │
└────────────┬────────────────────────┘
             │
┌────────────▼────────────────────────┐
│         Request Logging             │
│  • Method, Path, Status             │
│  • Response Time                    │
│  • User Agent, IP                   │
└────────────┬────────────────────────┘
             │
┌────────────▼────────────────────────┐
│         Error Tracking              │
│  • Stack traces                     │
│  • Error context                    │
│  • User information                 │
└────────────┬────────────────────────┘
             │
┌────────────▼────────────────────────┐
│         Analytics                   │
│  • API usage                        │
│  • Credit consumption               │
│  • Search patterns                  │
└─────────────────────────────────────┘
```

## Database Schema Relationships

```
┌──────────────┐
│    Users     │
│──────────────│
│ _id          │◄────┐
│ email        │     │
│ password     │     │
│ credits      │     │
└──────────────┘     │
                     │
                     │ userId (FK)
                     │
    ┌────────────────┼────────────────┬────────────────┐
    │                │                │                │
    ▼                ▼                ▼                ▼
┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│ Credit   │  │   Code   │  │  Search  │  │ Sessions │
│Transactions│ │Documents │  │ Queries  │  │          │
│──────────│  │──────────│  │──────────│  │──────────│
│ userId   │  │ userId   │  │ userId   │  │ userId   │
│ amount   │  │ code     │  │ query    │  │ token    │
│ type     │  │ language │  │ results  │  │ expires  │
└──────────┘  └──────────┘  └──────────┘  └──────────┘
```

## Technology Stack Layers

```
┌─────────────────────────────────────┐
│         Presentation Layer          │
│  • Express.js                       │
│  • REST API                         │
└────────────┬────────────────────────┘
             │
┌────────────▼────────────────────────┐
│         Application Layer           │
│  • TypeScript                       │
│  • Business Logic                   │
│  • Services                         │
└────────────┬────────────────────────┘
             │
┌────────────▼────────────────────────┐
│         Data Access Layer           │
│  • MongoDB Driver                   │
│  • Pinecone SDK                     │
└────────────┬────────────────────────┘
             │
┌────────────▼────────────────────────┐
│         Data Storage Layer          │
│  • MongoDB (Documents)              │
│  • Pinecone (Vectors)               │
└─────────────────────────────────────┘
```

## Deployment Architecture

### Production Setup

```
┌─────────────────────────────────────────────┐
│              Load Balancer                  │
│              (Nginx/AWS ALB)                │
└────────────────┬────────────────────────────┘
                 │
    ┌────────────┼────────────┐
    │            │            │
    ▼            ▼            ▼
┌────────┐  ┌────────┐  ┌────────┐
│ API    │  │ API    │  │ API    │
│ Server │  │ Server │  │ Server │
│   1    │  │   2    │  │   3    │
└───┬────┘  └───┬────┘  └───┬────┘
    │           │           │
    └───────────┼───────────┘
                │
    ┌───────────┼───────────┐
    │           │           │
    ▼           ▼           ▼
┌────────┐  ┌────────┐  ┌────────┐
│MongoDB │  │Pinecone│  │ Redis  │
│Cluster │  │        │  │ Cache  │
└────────┘  └────────┘  └────────┘
```

This architecture ensures:
- **Scalability**: Horizontal scaling of API servers
- **Reliability**: Database replication and failover
- **Performance**: Caching and load balancing
- **Security**: Multiple security layers
- **Maintainability**: Clean separation of concerns
