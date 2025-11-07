import { Request, Response, NextFunction } from 'express';
import { searchService } from '../services/search.service.js';
import { validateRequest, indexCodeSchema, searchCodeSchema, paginationSchema } from '../utils/validation.js';

export class SearchController {
  async indexCode(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { code, language, metadata } = validateRequest(indexCodeSchema, req.body);

      const document = await searchService.indexCode({
        userId,
        code,
        language,
        metadata,
      });

      res.status(201).json({
        success: true,
        data: document,
        message: 'Code indexed successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async searchCode(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { query, limit, filters } = validateRequest(searchCodeSchema, req.body);

      const result = await searchService.searchCode({
        userId,
        query,
        limit,
        filters,
      });

      res.status(200).json({
        success: true,
        data: result.results,
        meta: {
          creditsUsed: result.creditsUsed,
          resultsCount: result.results.length,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getDocuments(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { page, limit } = validateRequest(paginationSchema, {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 20,
      });

      const result = await searchService.getDocuments(userId, page, limit);

      res.status(200).json({
        success: true,
        data: result.documents,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteDocument(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { documentId } = req.params;

      if (!documentId) {
        res.status(400).json({
          success: false,
          error: 'Document ID is required',
        });
        return;
      }

      await searchService.deleteDocument(userId, documentId);

      res.status(200).json({
        success: true,
        message: 'Document deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async getSearchHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { page, limit } = validateRequest(paginationSchema, {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 20,
      });

      const result = await searchService.getSearchHistory(userId, page, limit);

      res.status(200).json({
        success: true,
        data: result.queries,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const searchController = new SearchController();
