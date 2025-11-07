import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { mongoDBService } from './mongodb.service.js';
import { logger } from '../utils/logger.js';
import {
  UnauthorizedError,
  ConflictError,
  ValidationError,
} from '../utils/errors.js';
import type { User, AuthTokens, JWTPayload, UserProfile } from '../types/index.js';

class AuthService {
  private readonly SALT_ROUNDS = 10;

  async register(
    email: string,
    password: string,
    name: string
  ): Promise<{ user: UserProfile; tokens: AuthTokens }> {
    // Check if user already exists
    const existingUser = await mongoDBService.findUserByEmail(email);
    if (existingUser) {
      throw new ConflictError('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, this.SALT_ROUNDS);

    // Create user
    const user = await mongoDBService.createUser({
      email,
      password: hashedPassword,
      name,
      credits: config.credits.default,
      role: 'user',
      isActive: true,
      emailVerified: false,
    });

    // Create welcome credit transaction
    await mongoDBService.createCreditTransaction({
      userId: user._id,
      amount: config.credits.default,
      type: 'bonus',
      description: 'Welcome bonus credits',
      balanceBefore: 0,
      balanceAfter: config.credits.default,
    });

    logger.info(`New user registered: ${email}`);

    // Generate tokens
    const tokens = this.generateTokens(user);

    return {
      user: this.sanitizeUser(user),
      tokens,
    };
  }

  async login(email: string, password: string): Promise<{ user: UserProfile; tokens: AuthTokens }> {
    // Find user
    const user = await mongoDBService.findUserByEmail(email);
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new UnauthorizedError('Account is deactivated');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Update last login
    await mongoDBService.updateUser(user._id, {
      lastLoginAt: new Date(),
    });

    logger.info(`User logged in: ${email}`);

    // Generate tokens
    const tokens = this.generateTokens(user);

    return {
      user: this.sanitizeUser(user),
      tokens,
    };
  }

  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    try {
      // Verify refresh token
      const decoded = jwt.verify(refreshToken, config.jwt.secret) as JWTPayload;

      // Find user
      const user = await mongoDBService.findUserById(decoded.userId);
      if (!user || !user.isActive) {
        throw new UnauthorizedError('Invalid refresh token');
      }

      // Generate new tokens
      return this.generateTokens(user);
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedError('Invalid refresh token');
      }
      throw error;
    }
  }

  async verifyToken(token: string): Promise<JWTPayload> {
    try {
      const decoded = jwt.verify(token, config.jwt.secret) as JWTPayload;
      return decoded;
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedError('Invalid token');
      }
      throw error;
    }
  }

  async getUserById(userId: string): Promise<UserProfile> {
    const user = await mongoDBService.findUserById(userId);
    if (!user) {
      throw new UnauthorizedError('User not found');
    }
    return this.sanitizeUser(user);
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void> {
    const user = await mongoDBService.findUserById(userId);
    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    // Verify old password
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid old password');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, this.SALT_ROUNDS);

    // Update password
    await mongoDBService.updateUser(userId, {
      password: hashedPassword,
    });

    logger.info(`Password changed for user: ${user.email}`);
  }

  private generateTokens(user: User): AuthTokens {
    const payload: JWTPayload = {
      userId: user._id,
      email: user.email,
      role: user.role,
    };

    const accessToken = jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    });

    const refreshToken = jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.refreshExpiresIn,
    });

    // Calculate expiration time in seconds
    const expiresIn = this.parseExpirationTime(config.jwt.expiresIn);

    return {
      accessToken,
      refreshToken,
      expiresIn,
    };
  }

  private parseExpirationTime(expiration: string): number {
    const match = expiration.match(/^(\d+)([smhd])$/);
    if (!match) return 3600; // Default 1 hour

    const value = parseInt(match[1], 10);
    const unit = match[2];

    const multipliers: Record<string, number> = {
      s: 1,
      m: 60,
      h: 3600,
      d: 86400,
    };

    return value * (multipliers[unit] || 3600);
  }

  private sanitizeUser(user: User): UserProfile {
    return {
      _id: user._id,
      email: user.email,
      name: user.name,
      credits: user.credits,
      role: user.role,
      createdAt: user.createdAt,
    };
  }
}

export const authService = new AuthService();
