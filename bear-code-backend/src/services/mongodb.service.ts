import { MongoClient, Db, Collection, ObjectId } from 'mongodb';
import { config } from '../config/index.js';
import { logger } from '../utils/logger.js';
import type { User, CreditTransaction, CodeDocument, SearchQuery } from '../types/index.js';

class MongoDBService {
  private client: MongoClient | null = null;
  private db: Db | null = null;

  async connect(): Promise<void> {
    try {
      this.client = new MongoClient(config.mongodb.uri);
      await this.client.connect();
      this.db = this.client.db(config.mongodb.database);
      
      await this.createIndexes();
      
      logger.info('MongoDB connected successfully');
    } catch (error) {
      logger.error('MongoDB connection error:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close();
      logger.info('MongoDB disconnected');
    }
  }

  private async createIndexes(): Promise<void> {
    if (!this.db) return;

    // Users collection indexes
    await this.db.collection('users').createIndex({ email: 1 }, { unique: true });
    await this.db.collection('users').createIndex({ createdAt: -1 });

    // Credit transactions indexes
    await this.db.collection('credit_transactions').createIndex({ userId: 1, createdAt: -1 });
    await this.db.collection('credit_transactions').createIndex({ type: 1 });

    // Code documents indexes
    await this.db.collection('code_documents').createIndex({ userId: 1, createdAt: -1 });
    await this.db.collection('code_documents').createIndex({ language: 1 });
    await this.db.collection('code_documents').createIndex({ 'metadata.projectName': 1 });

    // Search queries indexes
    await this.db.collection('search_queries').createIndex({ userId: 1, createdAt: -1 });

    logger.info('MongoDB indexes created');
  }

  getDb(): Db {
    if (!this.db) {
      throw new Error('Database not connected');
    }
    return this.db;
  }

  getCollection<T = any>(name: string): Collection<T> {
    return this.getDb().collection<T>(name);
  }

  // User operations
  async createUser(user: Omit<User, '_id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const now = new Date();
    const newUser = {
      ...user,
      createdAt: now,
      updatedAt: now,
    };

    const result = await this.getCollection<User>('users').insertOne(newUser as any);
    return { ...newUser, _id: result.insertedId.toString() };
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const user = await this.getCollection<User>('users').findOne({ email });
    return user ? { ...user, _id: user._id.toString() } : null;
  }

  async findUserById(id: string): Promise<User | null> {
    const user = await this.getCollection<User>('users').findOne({ _id: new ObjectId(id) } as any);
    return user ? { ...user, _id: user._id.toString() } : null;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    const result = await this.getCollection<User>('users').findOneAndUpdate(
      { _id: new ObjectId(id) } as any,
      { $set: { ...updates, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );

    return result ? { ...result, _id: result._id.toString() } : null;
  }

  async updateUserCredits(userId: string, amount: number): Promise<number> {
    const result = await this.getCollection<User>('users').findOneAndUpdate(
      { _id: new ObjectId(userId) } as any,
      { $inc: { credits: amount }, $set: { updatedAt: new Date() } },
      { returnDocument: 'after' }
    );

    return result?.credits || 0;
  }

  // Credit transaction operations
  async createCreditTransaction(
    transaction: Omit<CreditTransaction, '_id' | 'createdAt'>
  ): Promise<CreditTransaction> {
    const newTransaction = {
      ...transaction,
      createdAt: new Date(),
    };

    const result = await this.getCollection<CreditTransaction>('credit_transactions').insertOne(
      newTransaction as any
    );
    return { ...newTransaction, _id: result.insertedId.toString() };
  }

  async getCreditTransactions(
    userId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{ transactions: CreditTransaction[]; total: number }> {
    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      this.getCollection<CreditTransaction>('credit_transactions')
        .find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      this.getCollection<CreditTransaction>('credit_transactions').countDocuments({ userId }),
    ]);

    return {
      transactions: transactions.map((t) => ({ ...t, _id: t._id.toString() })),
      total,
    };
  }

  // Code document operations
  async createCodeDocument(
    doc: Omit<CodeDocument, '_id' | 'createdAt' | 'updatedAt'>
  ): Promise<CodeDocument> {
    const now = new Date();
    const newDoc = {
      ...doc,
      createdAt: now,
      updatedAt: now,
    };

    const result = await this.getCollection<CodeDocument>('code_documents').insertOne(newDoc as any);
    return { ...newDoc, _id: result.insertedId.toString() };
  }

  async getCodeDocuments(
    userId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{ documents: CodeDocument[]; total: number }> {
    const skip = (page - 1) * limit;

    const [documents, total] = await Promise.all([
      this.getCollection<CodeDocument>('code_documents')
        .find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      this.getCollection<CodeDocument>('code_documents').countDocuments({ userId }),
    ]);

    return {
      documents: documents.map((d) => ({ ...d, _id: d._id.toString() })),
      total,
    };
  }

  async deleteCodeDocument(id: string, userId: string): Promise<boolean> {
    const result = await this.getCollection<CodeDocument>('code_documents').deleteOne({
      _id: new ObjectId(id),
      userId,
    } as any);

    return result.deletedCount > 0;
  }

  // Search query operations
  async createSearchQuery(query: Omit<SearchQuery, '_id' | 'createdAt'>): Promise<SearchQuery> {
    const newQuery = {
      ...query,
      createdAt: new Date(),
    };

    const result = await this.getCollection<SearchQuery>('search_queries').insertOne(newQuery as any);
    return { ...newQuery, _id: result.insertedId.toString() };
  }

  async getSearchHistory(
    userId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{ queries: SearchQuery[]; total: number }> {
    const skip = (page - 1) * limit;

    const [queries, total] = await Promise.all([
      this.getCollection<SearchQuery>('search_queries')
        .find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      this.getCollection<SearchQuery>('search_queries').countDocuments({ userId }),
    ]);

    return {
      queries: queries.map((q) => ({ ...q, _id: q._id.toString() })),
      total,
    };
  }

  // Analytics
  async getUserStats(userId: string): Promise<{
    totalSearches: number;
    totalDocuments: number;
    totalCreditsUsed: number;
  }> {
    const [totalSearches, totalDocuments, creditTransactions] = await Promise.all([
      this.getCollection('search_queries').countDocuments({ userId }),
      this.getCollection('code_documents').countDocuments({ userId }),
      this.getCollection<CreditTransaction>('credit_transactions')
        .find({ userId, type: 'usage' })
        .toArray(),
    ]);

    const totalCreditsUsed = creditTransactions.reduce(
      (sum, t) => sum + Math.abs(t.amount),
      0
    );

    return {
      totalSearches,
      totalDocuments,
      totalCreditsUsed,
    };
  }
}

export const mongoDBService = new MongoDBService();
