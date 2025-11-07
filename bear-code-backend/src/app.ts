import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/index.js';
import { logger } from './utils/logger.js';
import { generalLimiter } from './middleware/rateLimit.middleware.js';
import { errorHandler, notFoundHandler } from './middleware/error.middleware.js';
import routes from './routes/index.js';

export function createApp(): Application {
  const app = express();

  // Security middleware
  app.use(helmet());
  app.use(
    cors({
      origin: config.cors.allowedOrigins,
      credentials: true,
    })
  );

  // Body parsing middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Rate limiting
  app.use(generalLimiter);

  // Request logging
  app.use((req, res, next) => {
    logger.info(`${req.method} ${req.path}`, {
      ip: req.ip,
      userAgent: req.get('user-agent'),
    });
    next();
  });

  // API routes
  app.use(`/api/${config.apiVersion}`, routes);

  // Root endpoint
  app.get('/', (req, res) => {
    res.json({
      success: true,
      message: 'Welcome to Bear Code API',
      version: config.apiVersion,
      documentation: `/api/${config.apiVersion}/health`,
    });
  });

  // Error handling
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
