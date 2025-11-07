import { Request, Response, NextFunction } from 'express';
import { mongoDBService } from '../services/mongodb.service.js';
import { authService } from '../services/auth.service.js';
import { validateRequest, updateProfileSchema } from '../utils/validation.js';

export class UserController {
  async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const user = await authService.getUserById(userId);

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const updates = validateRequest(updateProfileSchema, req.body);

      const updatedUser = await mongoDBService.updateUser(userId, updates);

      if (!updatedUser) {
        res.status(404).json({
          success: false,
          error: 'User not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: {
          _id: updatedUser._id,
          email: updatedUser.email,
          name: updatedUser.name,
          credits: updatedUser.credits,
          role: updatedUser.role,
          createdAt: updatedUser.createdAt,
        },
        message: 'Profile updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { oldPassword, newPassword } = req.body;

      if (!oldPassword || !newPassword) {
        res.status(400).json({
          success: false,
          error: 'Old password and new password are required',
        });
        return;
      }

      await authService.changePassword(userId, oldPassword, newPassword);

      res.status(200).json({
        success: true,
        message: 'Password changed successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async getStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const stats = await mongoDBService.getUserStats(userId);

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;

      // Soft delete by deactivating account
      await mongoDBService.updateUser(userId, {
        isActive: false,
      });

      res.status(200).json({
        success: true,
        message: 'Account deactivated successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

export const userController = new UserController();
