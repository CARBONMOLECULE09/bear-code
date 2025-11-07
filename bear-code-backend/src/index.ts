import { createApp } from './app.js';
import { config } from './config/index.js';
import { logger } from './utils/logger.js';
import { mongoDBService } from './services/mongodb.service.js';
import { initializeDatabases, testDatabaseConnections } from './utils/db-init.js';

async function startServer() {
  try {
    // Initialize services
    logger.info('🚀 Starting Bear Code Backend...');
    logger.info('📋 Configuration:', {
      env: config.env,
      port: config.port,
      database: config.mongodb.database,
      pineconeIndex: config.pinecone.indexName,
    });
    
    // Initialize databases
    await initializeDatabases();
    
    // Test connections
    const connectionStatus = await testDatabaseConnections();
    logger.info('🔌 Database connection status:', connectionStatus);
    
    if (!connectionStatus.mongodb) {
      throw new Error('MongoDB connection failed');
    }
    
    if (!connectionStatus.pinecone) {
      logger.warn('⚠️  Pinecone connection failed - semantic search will be limited');
    }

    // Create Express app
    const app = createApp();

    // Start server
    const server = app.listen(config.port, () => {
      logger.info(`🐻 Bear Code API running on port ${config.port}`);
      logger.info(`Environment: ${config.env}`);
      logger.info(`API Version: ${config.apiVersion}`);
      logger.info(`Health check: http://localhost:${config.port}/api/${config.apiVersion}/health`);
    });

    // Graceful shutdown
    const gracefulShutdown = async (signal: string) => {
      logger.info(`${signal} received, shutting down gracefully...`);

      server.close(async () => {
        logger.info('HTTP server closed');

        try {
          await mongoDBService.disconnect();
          logger.info('MongoDB disconnected');

          process.exit(0);
        } catch (error) {
          logger.error('Error during shutdown:', error);
          process.exit(1);
        }
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Handle uncaught errors
    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception:', error);
      process.exit(1);
    });

    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
      process.exit(1);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
