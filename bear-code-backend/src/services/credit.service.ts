import { mongoDBService } from './mongodb.service.js';
import { logger } from '../utils/logger.js';
import { InsufficientCreditsError, NotFoundError } from '../utils/errors.js';
import type { CreditTransaction, PaginatedResponse } from '../types/index.js';

class CreditService {
  async getBalance(userId: string): Promise<number> {
    const user = await mongoDBService.findUserById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user.credits;
  }

  async deductCredits(
    userId: string,
    amount: number,
    operation: string,
    description: string
  ): Promise<number> {
    const user = await mongoDBService.findUserById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (user.credits < amount) {
      throw new InsufficientCreditsError(
        `Insufficient credits. Required: ${amount}, Available: ${user.credits}`
      );
    }

    const balanceBefore = user.credits;
    const newBalance = await mongoDBService.updateUserCredits(userId, -amount);

    await mongoDBService.createCreditTransaction({
      userId,
      amount: -amount,
      type: 'usage',
      operation,
      description,
      balanceBefore,
      balanceAfter: newBalance,
    });

    logger.info(`Deducted ${amount} credits from user ${userId} for ${operation}`);
    return newBalance;
  }

  async addCredits(
    userId: string,
    amount: number,
    type: 'purchase' | 'bonus' | 'refund',
    description: string,
    metadata?: Record<string, any>
  ): Promise<number> {
    const user = await mongoDBService.findUserById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const balanceBefore = user.credits;
    const newBalance = await mongoDBService.updateUserCredits(userId, amount);

    await mongoDBService.createCreditTransaction({
      userId,
      amount,
      type,
      description,
      balanceBefore,
      balanceAfter: newBalance,
      metadata,
    });

    logger.info(`Added ${amount} credits to user ${userId} (${type})`);
    return newBalance;
  }

  async purchaseCredits(
    userId: string,
    amount: number,
    paymentMethod: string
  ): Promise<{ balance: number; transaction: CreditTransaction }> {
    // In production, integrate with payment gateway here
    // For now, we'll simulate a successful purchase

    const transaction = await mongoDBService.createCreditTransaction({
      userId,
      amount,
      type: 'purchase',
      description: `Purchased ${amount} credits`,
      balanceBefore: 0, // Will be updated
      balanceAfter: 0, // Will be updated
      metadata: {
        paymentMethod,
        transactionId: `txn_${Date.now()}`,
      },
    });

    const balance = await this.addCredits(
      userId,
      amount,
      'purchase',
      `Purchased ${amount} credits via ${paymentMethod}`,
      { transactionId: transaction._id }
    );

    logger.info(`User ${userId} purchased ${amount} credits`);

    return { balance, transaction };
  }

  async getTransactionHistory(
    userId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<CreditTransaction>> {
    const { transactions, total } = await mongoDBService.getCreditTransactions(
      userId,
      page,
      limit
    );

    return {
      data: transactions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async refundCredits(
    userId: string,
    amount: number,
    reason: string,
    originalTransactionId?: string
  ): Promise<number> {
    return this.addCredits(userId, amount, 'refund', `Refund: ${reason}`, {
      originalTransactionId,
    });
  }

  async checkSufficientCredits(userId: string, requiredAmount: number): Promise<boolean> {
    const balance = await this.getBalance(userId);
    return balance >= requiredAmount;
  }
}

export const creditService = new CreditService();
