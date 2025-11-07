import dotenv from 'dotenv';

dotenv.config();

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  apiVersion: process.env.API_VERSION || 'v1',

  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017',
    database: process.env.MONGODB_DATABASE || 'bearcode',
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  },

  pinecone: {
    apiKey: process.env.PINECONE_API_KEY || '',
    environment: process.env.PINECONE_ENVIRONMENT || 'us-east-1-aws',
    indexName: process.env.PINECONE_INDEX_NAME || 'bearcode-semantic-search',
  },

  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },

  credits: {
    default: parseInt(process.env.DEFAULT_CREDITS || '100', 10),
    costPerQuery: parseInt(process.env.CREDIT_COST_PER_QUERY || '1', 10),
    costPerGeneration: parseInt(process.env.CREDIT_COST_PER_GENERATION || '5', 10),
    costPerSearch: parseInt(process.env.CREDIT_COST_PER_SEARCH || '2', 10),
  },

  cors: {
    allowedOrigins: (process.env.ALLOWED_ORIGINS || 'http://localhost:3000').split(','),
  },

  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },
};

export const isDevelopment = config.env === 'development';
export const isProduction = config.env === 'production';
