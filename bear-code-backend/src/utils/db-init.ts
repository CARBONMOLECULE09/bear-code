import { mongoDBService } from '../services/mongodb.service.js';
import { pineconeService } from '../services/pinecone.service.js';
import { logger } from './logger.js';

/**
 * Initialize and verify database connections
 */
export async function initializeDatabases(): Promise<void> {
  logger.info('🔄 Initializing databases...');

  try {
    // Initialize MongoDB
    logger.info('📦 Connecting to MongoDB...');
    await mongoDBService.connect();
    logger.info('✅ MongoDB connected successfully');

    // Verify MongoDB collections
    const db = mongoDBService.getDb();
    const collections = await db.listCollections().toArray();
    logger.info(`📊 Found ${collections.length} MongoDB collections:`, {
      collections: collections.map(c => c.name),
    });

    // Initialize Pinecone
    logger.info('🔍 Initializing Pinecone...');
    await pineconeService.initialize();
    logger.info('✅ Pinecone initialized successfully');

    // Verify Pinecone index
    const stats = await pineconeService.getIndexStats();
    logger.info('📊 Pinecone index stats:', stats);

    logger.info('🎉 All databases initialized successfully!');
  } catch (error) {
    logger.error('❌ Database initialization failed:', error);
    throw error;
  }
}

/**
 * Test database connections
 */
export async function testDatabaseConnections(): Promise<{
  mongodb: boolean;
  pinecone: boolean;
}> {
  const results = {
    mongodb: false,
    pinecone: false,
  };

  // Test MongoDB
  try {
    const db = mongoDBService.getDb();
    await db.admin().ping();
    results.mongodb = true;
    logger.info('✅ MongoDB connection test passed');
  } catch (error) {
    logger.error('❌ MongoDB connection test failed:', error);
  }

  // Test Pinecone
  try {
    await pineconeService.getIndexStats();
    results.pinecone = true;
    logger.info('✅ Pinecone connection test passed');
  } catch (error) {
    logger.error('❌ Pinecone connection test failed:', error);
  }

  return results;
}
