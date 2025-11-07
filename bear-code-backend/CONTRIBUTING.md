# Contributing to Bear Code Backend

Thank you for your interest in contributing to Bear Code Backend! This document provides guidelines and instructions for contributing.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/bear-code-backend.git`
3. Create a branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Test your changes
6. Commit: `git commit -m "Add your feature"`
7. Push: `git push origin feature/your-feature-name`
8. Create a Pull Request

## Development Setup

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm run dev
```

## Code Style

We use ESLint and Prettier for code formatting:

```bash
# Format code
npm run format

# Lint code
npm run lint
```

### TypeScript Guidelines

- Use explicit types where possible
- Avoid `any` type
- Use interfaces for object shapes
- Use enums for constants
- Document complex functions with JSDoc

### Naming Conventions

- **Files**: kebab-case (e.g., `user.service.ts`)
- **Classes**: PascalCase (e.g., `UserService`)
- **Functions**: camelCase (e.g., `getUserById`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_RETRIES`)
- **Interfaces**: PascalCase with descriptive names (e.g., `UserProfile`)

## Project Structure

```
src/
├── config/          # Configuration files
├── controllers/     # Route controllers
├── middleware/      # Express middleware
├── models/          # Data models (if using ORM)
├── routes/          # API routes
├── services/        # Business logic
├── types/           # TypeScript types
├── utils/           # Utility functions
└── index.ts         # Entry point
```

## Adding New Features

### 1. Create Service

```typescript
// src/services/feature.service.ts
class FeatureService {
  async doSomething(): Promise<Result> {
    // Implementation
  }
}

export const featureService = new FeatureService();
```

### 2. Create Controller

```typescript
// src/controllers/feature.controller.ts
export class FeatureController {
  async handleRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await featureService.doSomething();
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}
```

### 3. Create Routes

```typescript
// src/routes/feature.routes.ts
import { Router } from 'express';
import { featureController } from '../controllers/feature.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();
router.get('/', authenticate, featureController.handleRequest);

export default router;
```

### 4. Register Routes

```typescript
// src/routes/index.ts
import featureRoutes from './feature.routes.js';

router.use('/feature', featureRoutes);
```

## Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Writing Tests

```typescript
import { describe, it, expect } from 'vitest';

describe('FeatureService', () => {
  it('should do something', async () => {
    const result = await featureService.doSomething();
    expect(result).toBeDefined();
  });
});
```

## Error Handling

Always use custom error classes:

```typescript
import { ValidationError, NotFoundError } from '../utils/errors.js';

if (!user) {
  throw new NotFoundError('User not found');
}

if (!isValid) {
  throw new ValidationError('Invalid input');
}
```

## Logging

Use the logger utility:

```typescript
import { logger } from '../utils/logger.js';

logger.info('Operation completed');
logger.error('Operation failed', error);
logger.warn('Warning message');
logger.debug('Debug information');
```

## Database Operations

### MongoDB

```typescript
import { mongoDBService } from '../services/mongodb.service.js';

// Create
const user = await mongoDBService.createUser(userData);

// Read
const user = await mongoDBService.findUserById(userId);

// Update
const updated = await mongoDBService.updateUser(userId, updates);

// Delete
await mongoDBService.deleteUser(userId);
```

### Pinecone

```typescript
import { pineconeService } from '../services/pinecone.service.js';

// Index
await pineconeService.indexCode({
  id: 'doc-id',
  text: 'code content',
  metadata: { language: 'javascript' }
});

// Search
const results = await pineconeService.searchCode(query, userId, limit);
```

## API Documentation

When adding new endpoints, update:
1. `API.md` - Add endpoint documentation
2. `postman_collection.json` - Add Postman request
3. `README.md` - Update feature list if needed

## Commit Messages

Follow conventional commits:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance tasks

Examples:
```
feat: add user profile endpoint
fix: resolve credit deduction bug
docs: update API documentation
refactor: improve error handling
```

## Pull Request Process

1. Update documentation
2. Add tests for new features
3. Ensure all tests pass
4. Update CHANGELOG.md
5. Request review from maintainers

### PR Checklist

- [ ] Code follows style guidelines
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No console.logs or debug code
- [ ] Error handling implemented
- [ ] Types properly defined
- [ ] Commits follow convention

## Security

- Never commit sensitive data (API keys, passwords)
- Use environment variables for secrets
- Validate all user inputs
- Sanitize data before database operations
- Follow OWASP security guidelines

## Questions?

- Open an issue for bugs
- Start a discussion for feature requests
- Join our Discord for questions

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
