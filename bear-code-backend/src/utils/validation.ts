import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  email: z.string().email('Invalid email address').optional(),
});

export const purchaseCreditsSchema = z.object({
  amount: z.number().int().positive('Amount must be a positive integer'),
  paymentMethod: z.string().min(1, 'Payment method is required'),
});

export const indexCodeSchema = z.object({
  code: z.string().min(1, 'Code is required'),
  language: z.string().min(1, 'Language is required'),
  metadata: z
    .object({
      fileName: z.string().optional(),
      filePath: z.string().optional(),
      projectName: z.string().optional(),
      tags: z.array(z.string()).optional(),
    })
    .passthrough()
    .optional(),
});

export const searchCodeSchema = z.object({
  query: z.string().min(1, 'Query is required'),
  limit: z.number().int().positive().max(100).optional().default(10),
  filters: z.record(z.any()).optional(),
});

export const paginationSchema = z.object({
  page: z.number().int().positive().optional().default(1),
  limit: z.number().int().positive().max(100).optional().default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export function validateRequest<T>(schema: z.ZodSchema<T>, data: unknown): T {
  return schema.parse(data);
}
