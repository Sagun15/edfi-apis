import { Injectable, NestMiddleware } from '@nestjs/common';
import { CustomLogger } from '../utils/logger/logger.service';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger = new CustomLogger();

  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - start;
      this.logger.logRequest(req, res, duration);
    });

    next();
  }
}
