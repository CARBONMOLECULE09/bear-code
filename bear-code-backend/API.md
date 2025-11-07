# Bear Code API Documentation

## Base URL
```
http://localhost:3000/api/v1
```

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your_access_token>
```

---

## Authentication Endpoints

### Register User
**POST** `/auth/register`

Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "user_id",
      "email": "user@example.com",
      "name": "John Doe",
      "credits": 100,
      "role": "user",
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "tokens": {
      "accessToken": "jwt_token",
      "refreshToken": "refresh_token",
      "expiresIn": 604800
    }
  },
  "message": "User registered successfully"
}
```

### Login
**POST** `/auth/login`

Authenticate and receive access tokens.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": { ... },
    "tokens": { ... }
  },
  "message": "Login successful"
}
```

### Refresh Token
**POST** `/auth/refresh`

Get new access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "your_refresh_token"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "new_jwt_token",
    "refreshToken": "new_refresh_token",
    "expiresIn": 604800
  },
  "message": "Token refreshed successfully"
}
```

---

## User Endpoints

### Get Profile
**GET** `/users/profile`

Get current user profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "user_id",
    "email": "user@example.com",
    "name": "John Doe",
    "credits": 95,
    "role": "user",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Update Profile
**PUT** `/users/profile`

Update user profile information.

**Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com"
}
```

### Change Password
**POST** `/users/change-password`

Change user password.

**Request Body:**
```json
{
  "oldPassword": "OldPass123",
  "newPassword": "NewPass123"
}
```

### Get User Stats
**GET** `/users/stats`

Get user usage statistics.

**Response:**
```json
{
  "success": true,
  "data": {
    "totalSearches": 42,
    "totalDocuments": 15,
    "totalCreditsUsed": 85
  }
}
```

---

## Credit Endpoints

### Get Balance
**GET** `/credits/balance`

Get current credit balance.

**Response:**
```json
{
  "success": true,
  "data": {
    "balance": 95
  }
}
```

### Purchase Credits
**POST** `/credits/purchase`

Purchase additional credits.

**Request Body:**
```json
{
  "amount": 100,
  "paymentMethod": "credit_card"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "balance": 195,
    "transaction": {
      "_id": "transaction_id",
      "amount": 100,
      "type": "purchase",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  },
  "message": "Credits purchased successfully"
}
```

### Get Transaction History
**GET** `/credits/transactions?page=1&limit=20`

Get credit transaction history.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "transaction_id",
      "userId": "user_id",
      "amount": -5,
      "type": "usage",
      "operation": "search_code",
      "description": "Semantic code search",
      "balanceBefore": 100,
      "balanceAfter": 95,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 42,
    "totalPages": 3
  }
}
```

---

## Search Endpoints

### Index Code
**POST** `/search/index`

Index a code document for semantic search.

**Cost:** 1 credit

**Request Body:**
```json
{
  "code": "function hello() { console.log('Hello World'); }",
  "language": "javascript",
  "metadata": {
    "fileName": "hello.js",
    "filePath": "/src/utils/hello.js",
    "projectName": "my-project",
    "tags": ["utility", "greeting"]
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "document_id",
    "userId": "user_id",
    "code": "function hello() { ... }",
    "language": "javascript",
    "metadata": { ... },
    "vectorId": "vector_id",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Code indexed successfully"
}
```

### Search Code
**POST** `/search/query`

Search for similar code using semantic search.

**Cost:** 2 credits per search

**Request Body:**
```json
{
  "query": "function that prints hello world",
  "limit": 10,
  "filters": {
    "language": "javascript",
    "projectName": "my-project"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "document_id",
      "code": "function hello() { ... }",
      "language": "javascript",
      "metadata": { ... },
      "score": 0.95
    }
  ],
  "meta": {
    "creditsUsed": 2,
    "resultsCount": 1
  }
}
```

### Get Documents
**GET** `/search/documents?page=1&limit=20`

Get all indexed code documents.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)

**Response:**
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 15,
    "totalPages": 1
  }
}
```

### Delete Document
**DELETE** `/search/documents/:documentId`

Delete an indexed code document.

**Response:**
```json
{
  "success": true,
  "message": "Document deleted successfully"
}
```

### Get Search History
**GET** `/search/history?page=1&limit=20`

Get search query history.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "userId": "user_id",
      "query": "function that prints hello world",
      "filters": { ... },
      "limit": 10,
      "results": 1,
      "creditsUsed": 2,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": { ... }
}
```

---

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "error": "Error message"
}
```

### Common HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid/missing token)
- `402` - Payment Required (insufficient credits)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (e.g., email already exists)
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error

---

## Rate Limits

- **General API**: 100 requests per 15 minutes
- **Authentication**: 5 requests per 15 minutes
- **Search**: 20 requests per minute

---

## Credit Costs

- **Index Code**: 1 credit per document
- **Search Code**: 2 credits per search
- **Code Generation**: 5 credits per generation (future feature)

---

## Pagination

All list endpoints support pagination with these query parameters:

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)
- `sortBy`: Field to sort by (optional)
- `sortOrder`: `asc` or `desc` (default: `desc`)

Response includes pagination metadata:

```json
{
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```
