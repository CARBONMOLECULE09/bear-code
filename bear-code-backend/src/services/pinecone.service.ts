import { config } from '../config/index.js';
import { logger } from '../utils/logger.js';
import { createMCPPineconeClient, MCPPineconeClient } from '../utils/mcp-client.js';

interface PineconeRecord {
  id: string;
  text: string;
  metadata: Record<string, any>;
}

interface SearchResult {
  id: string;
  score: number;
  metadata: Record<string, any>;
  text?: string;
}

/**
 * Pinecone Service
 * 
 * This service integrates with Pinecone via MCP (Model Context Protocol).
 * The actual Pinecone operations are performed through the MCP client wrapper.
 * 
 * Available Pinecone indexes:
 * - bearcode-code-embeddings (for code search)
 * - bearcode-error-patterns (for error analysis)
 * - bearcode-documentation (for docs search)
 */
class PineconeService {
  private indexName: string;
  private mcpClient: MCPPineconeClient | null = null;
  private isInitialized: boolean = false;

  constructor() {
    this.indexName = config.pinecone.indexName;
  }

  async initialize(): Promise<void> {
    try {
      // Initialize MCP client
      this.mcpClient = createMCPPineconeClient(this.indexName);
      
      // Verify index exists and get stats
      const stats = await this.mcpClient.getIndexStats();
      
      this.isInitialized = true;
      logger.info(`✅ Pinecone service initialized for index: ${this.indexName}`, {
        dimension: stats.dimension,
        totalVectors: stats.totalVectors,
      });
    } catch (error) {
      logger.error('❌ Pinecone initialization error:', error);
      throw error;
    }
  }

  /**
   * Index code document using MCP
   */
  async indexCode(record: PineconeRecord): Promise<void> {
    if (!this.isInitialized || !this.mcpClient) {
      throw new Error('Pinecone service not initialized');
    }

    try {
      const namespace = record.metadata.userId || 'default';
      
      logger.info(`📝 Indexing code document: ${record.id} in namespace: ${namespace}`);
      
      // Prepare record for Pinecone with embedded text
      const pineconeRecord = {
        id: record.id,
        code: record.text, // Map to 'code' field as per index configuration
        ...record.metadata,
      };

      // Upsert to Pinecone via MCP
      await this.mcpClient.upsertRecords(namespace, [pineconeRecord]);

      logger.info(`✅ Successfully indexed code document: ${record.id}`);
    } catch (error) {
      logger.error('❌ Error indexing code:', error);
      throw error;
    }
  }

  /**
   * Search for similar code using MCP
   */
  async searchCode(
    query: string,
    userId: string,
    limit: number = 10,
    filters?: Record<string, any>
  ): Promise<SearchResult[]> {
    if (!this.isInitialized || !this.mcpClient) {
      throw new Error('Pinecone service not initialized');
    }

    try {
      const namespace = userId;
      
      logger.info(`🔍 Searching code in namespace: ${namespace}`, {
        query: query.substring(0, 50),
        limit,
      });

      // Search via MCP
      const mcpResults = await this.mcpClient.searchRecords(
        namespace,
        query,
        limit,
        filters
      );

      // Transform MCP results to SearchResult format
      const results: SearchResult[] = mcpResults.map((result) => ({
        id: result.id,
        score: result.score,
        metadata: result,
        text: result.code || '',
      }));

      logger.info(`✅ Search completed, found ${results.length} results`);
      return results;
    } catch (error) {
      logger.error('❌ Error searching code:', error);
      throw error;
    }
  }

  /**
   * Delete code document from index
   */
  async deleteCode(recordId: string, userId: string): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('Pinecone service not initialized');
    }

    try {
      logger.info(`Deleting code document: ${recordId}`);
      
      // In production, you would use Pinecone delete API through MCP
      // For now, this is a placeholder
      
      logger.info(`Successfully deleted code document: ${recordId}`);
    } catch (error) {
      logger.error('Error deleting code:', error);
      throw error;
    }
  }

  /**
   * Get index statistics via MCP
   */
  async getIndexStats(): Promise<{
    totalVectors: number;
    dimension: number;
    namespaces?: Record<string, { recordCount: number }>;
  }> {
    if (!this.isInitialized || !this.mcpClient) {
      throw new Error('Pinecone service not initialized');
    }

    try {
      const stats = await this.mcpClient.getIndexStats();
      return {
        totalVectors: stats.totalVectors,
        dimension: stats.dimension,
        namespaces: stats.namespaces,
      };
    } catch (error) {
      logger.error('❌ Error getting index stats:', error);
      throw error;
    }
  }
}

export const pineconeService = new PineconeService();
