#!/usr/bin/env tsx

/**
 * Database Connection Test Script
 * 
 * This script tests connections to both MongoDB and Pinecone
 * and displays detailed information about the databases.
 */

import { config } from '../src/config/index.js';
import { mongoDBService } from '../src/services/mongodb.service.js';
import { pineconeService } from '../src/services/pinecone.service.js';
import { logger } from '../src/utils/logger.js';

async function testDatabases() {
  console.log('🐻 Bear Code - Database Connection Test\n');
  console.log('=' .repeat(60));
  
  let mongoSuccess = false;
  let pineconeSuccess = false;

  // Test MongoDB
  console.log('\n📦 Testing MongoDB Connection...');
  console.log('-'.repeat(60));
  try {
    await mongoDBService.connect();
    console.log('✅ MongoDB connected successfully!');
    
    const db = mongoDBService.getDb();
    
    // List collections
    const collections = await db.listCollections().toArray();
    console.log(`\n📊 Database: ${config.mongodb.database}`);
    console.log(`📁 Collections (${collections.length}):`);
    collections.forEach(col => {
      console.log(`   - ${col.name}`);
    });
    
    // Get database stats
    const stats = await db.stats();
    console.log(`\n📈 Database Stats:`);
    console.log(`   - Size: ${(stats.dataSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   - Collections: ${stats.collections}`);
    console.log(`   - Indexes: ${stats.indexes}`);
    
    mongoSuccess = true;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
  }

  // Test Pinecone
  console.log('\n\n🔍 Testing Pinecone Connection...');
  console.log('-'.repeat(60));
  try {
    await pineconeService.initialize();
    console.log('✅ Pinecone initialized successfully!');
    
    const stats = await pineconeService.getIndexStats();
    console.log(`\n📊 Index: ${config.pinecone.indexName}`);
    console.log(`📈 Index Stats:`);
    console.log(`   - Dimension: ${stats.dimension}`);
    console.log(`   - Total Vectors: ${stats.totalVectors}`);
    
    if (stats.namespaces && Object.keys(stats.namespaces).length > 0) {
      console.log(`   - Namespaces: ${Object.keys(stats.namespaces).length}`);
      Object.entries(stats.namespaces).forEach(([ns, data]) => {
        console.log(`     • ${ns}: ${data.recordCount} records`);
      });
    } else {
      console.log(`   - Namespaces: 0 (empty index)`);
    }
    
    pineconeSuccess = true;
  } catch (error) {
    console.error('❌ Pinecone connection failed:', error);
  }

  // Summary
  console.log('\n\n' + '='.repeat(60));
  console.log('📋 Connection Summary:');
  console.log('-'.repeat(60));
  console.log(`MongoDB:   ${mongoSuccess ? '✅ Connected' : '❌ Failed'}`);
  console.log(`Pinecone:  ${pineconeSuccess ? '✅ Connected' : '❌ Failed'}`);
  console.log('='.repeat(60));

  // Cleanup
  if (mongoSuccess) {
    await mongoDBService.disconnect();
  }

  // Exit
  const exitCode = (mongoSuccess && pineconeSuccess) ? 0 : 1;
  process.exit(exitCode);
}

// Run tests
testDatabases().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
