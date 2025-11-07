import { Request, Response, NextFunction } from 'express';
import { creditService } from '../services/credit.service.js';
import { validateRequest, purchaseCreditsSchema, paginationSchema } from '../utils/validation.js';

export class CreditController {
  async getBalance(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const balance = await creditService.getBalance(userId);

      res.status(200).json({
        success: true,
        data: { balance },
      });
    } catch (error) {
      next(error);
    }
  }

  async purchaseCredits(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { amount, paymentMethod } = validateRequest(purchaseCreditsSchema, req.body);

      const result = await creditService.purchaseCredits(userId, amount, paymentMethod);

      res.status(200).json({
        success: true,
        data: result,
        message: 'Credits purchased successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async getTransactionHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { page, limit } = validateRequest(paginationSchema, {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 20,
      });

      const result = await creditService.getTransactionHistory(userId, page, limit);

      res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  async addBonus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Admin only endpoint
      const { userId, amount, description } = req.body;

      if (!userId || !amount || !description) {
        res.status(400).json({
          success: false,
          error: 'userId, amount, and description are required',
        });
        return;
      }

      const balance = await creditService.addCredits(
        userId,
        amount,
        'bonus',
        description
      );

      res.status(200).json({
        success: true,
        data: { balance },
        message: 'Bonus credits added successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async refundCredits(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Admin only endpoint
      const { userId, amount, reason, originalTransactionId } = req.body;

      if (!userId || !amount || !reason) {
        res.status(400).json({
          success: false,
          error: 'userId, amount, and reason are required',
        });
        return;
      }

      const balance = await creditService.refundCredits(
        userId,
        amount,
        reason,
        originalTransactionId
      );

      res.status(200).json({
        success: true,
        data: { balance },
        message: 'Credits refunded successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

export const creditController = new CreditController();
