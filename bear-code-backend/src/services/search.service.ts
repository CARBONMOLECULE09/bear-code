import { v4 as uuidv4 } from 'uuid';
import { mongoDBService } from './mongodb.service.js';
import { pineconeService } from './pinecone.service.js';
import { creditService } from './credit.service.js';
import { logger } from '../utils/logger.js';
import { config } from '../config/index.js';
import type { CodeDocument } from '../types/index.js';

interface IndexCodeParams {
  userId: string;
  code: string;
  language: string;
  metadata?: {
    fileName?: string;
    filePath?: string;
    projectName?: string;
    tags?: string[];
    [key: string]: any;
  };
}

interface SearchCodeParams {
  userId: string;
  query: string;
  limit?: number;
  filters?: Record<string, any>;
}

interface SearchResult {
  id: string;
  code: string;
  language: string;
  metadata: Record<string, any>;
  score: number;
}

class SearchService {
  async indexCode(params: IndexCodeParams): Promise<CodeDocument> {
    const { userId, code, language, metadata = {} } = params;

    // Deduct credits for indexing
    await creditService.deductCredits(
      userId,
      config.credits.costPerQuery,
      'index_code',
      'Index code document'
    );

    // Create document in MongoDB
    const vectorId = uuidv4();
    const document = await mongoDBService.createCodeDocument({
      userId,
      code,
      language,
      metadata,
      vectorId,
    });

    // Index in Pinecone
    try {
      await pineconeService.indexCode({
        id: vectorId,
        text: code,
        metadata: {
          userId,
          documentId: document._id,
          language,
          ...metadata,
        },
      });

      logger.info(`Indexed code document ${document._id} for user ${userId}`);
    } catch (error) {
      logger.error('Error indexing in Pinecone:', error);
      // Optionally: refund credits or mark document as failed
      throw error;
    }

    return document;
  }

  async searchCode(params: SearchCodeParams): Promise<{
    results: SearchResult[];
    creditsUsed: number;
  }> {
    const { userId, query, limit = 10, filters = {} } = params;

    // Deduct credits for search
    const creditsUsed = config.credits.costPerSearch;
    await creditService.deductCredits(
      userId,
      creditsUsed,
      'search_code',
      'Semantic code search'
    );

    // Search in Pinecone
    const pineconeResults = await pineconeService.searchCode(
      query,
      userId,
      limit,
      filters
    );

    // Log search query
    await mongoDBService.createSearchQuery({
      userId,
      query,
      filters,
      limit,
      results: pineconeResults.length,
      creditsUsed,
    });

    // Fetch full documents from MongoDB
    const results: SearchResult[] = [];
    for (const result of pineconeResults) {
      const documentId = result.metadata.documentId;
      if (documentId) {
        const doc = await mongoDBService.getCollection('code_documents').findOne({
          _id: documentId,
        });

        if (doc) {
          results.push({
            id: doc._id.toString(),
            code: doc.code,
            language: doc.language,
            metadata: doc.metadata,
            score: result.score,
          });
        }
      }
    }

    logger.info(`Search completed for user ${userId}, found ${results.length} results`);

    return {
      results,
      creditsUsed,
    };
  }

  async getDocuments(
    userId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{
    documents: CodeDocument[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const { documents, total } = await mongoDBService.getCodeDocuments(userId, page, limit);

    return {
      documents,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async deleteDocument(userId: string, documentId: string): Promise<void> {
    // Find document
    const doc = await mongoDBService.getCollection<CodeDocument>('code_documents').findOne({
      _id: documentId,
      userId,
    } as any);

    if (!doc) {
      throw new Error('Document not found');
    }

    // Delete from Pinecone
    if (doc.vectorId) {
      try {
        await pineconeService.deleteCode(doc.vectorId, userId);
      } catch (error) {
        logger.error('Error deleting from Pinecone:', error);
        // Continue with MongoDB deletion even if Pinecone fails
      }
    }

    // Delete from MongoDB
    await mongoDBService.deleteCodeDocument(documentId, userId);

    logger.info(`Deleted document ${documentId} for user ${userId}`);
  }

  async getSearchHistory(
    userId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{
    queries: any[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const { queries, total } = await mongoDBService.getSearchHistory(userId, page, limit);

    return {
      queries,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}

export const searchService = new SearchService();
