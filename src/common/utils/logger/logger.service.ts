import { Injectable, LoggerService, Scope } from '@nestjs/common';
import {
  createLogger,
  format,
  transports,
  Logger as WinstonLogger,
} from 'winston';
import { Request, Response } from 'express';

@Injectable({ scope: Scope.TRANSIENT })
export class CustomLogger implements LoggerService {
  private context?: string;
  private winstonLogger: WinstonLogger;

  constructor() {
    this.winstonLogger = createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: format.combine(
        format.timestamp(),
        format.errors({ stack: true }),
        format.printf((info) => {
          // Safely stringify objects with circular references
          const safeStringify = (obj: any): string => {
            const seen = new WeakSet();
            return JSON.stringify(
              obj,
              (key, value) => {
                // Handle Error objects specially
                if (value instanceof Error) {
                  return {
                    message: value.message,
                    stack: value.stack,
                    ...(value as any), // Include any custom properties
                  };
                }

                // Handle circular references
                if (typeof value === 'object' && value !== null) {
                  if (seen.has(value)) {
                    return '[Circular]';
                  }
                  seen.add(value);
                }
                return value;
              },
              2,
            );
          };

          // Prepare log entry object
          const logEntry = {
            timestamp: info.timestamp,
            level: info.level,
            context: this.context,
            message: info.message,
          };

          // Add additional metadata while filtering out standard keys
          const meta = { ...info };
          delete meta.timestamp;
          delete meta.level;
          delete meta.message;
          delete meta.context;

          if (Object.keys(meta).length > 0) {
            Object.assign(logEntry, meta);
          }

          return safeStringify(logEntry);
        }),
      ),

      // Log format control:
      // - For human-readable, pretty-printed logs, set LOG_FORMAT=pretty in .env
      // - For machine-readable single-line JSON logs (better for CloudWatch), don't set LOG_FORMAT
      transports: [
        process.env.LOG_FORMAT === 'pretty'
          ? new transports.Console()
          : new transports.Console({
              format: format.json(),
            }),

        new transports.File({ filename: 'logs/error.log', level: 'error' }),
        new transports.File({ filename: 'logs/combined.log' }),
      ],
    });
  }

  setContext(context: string) {
    this.context = context;
  }

  log(message: string, meta: Record<string, any> = {}) {
    this.winstonLogger.info(message, this.sanitizeMetadata(meta));
  }

  error(message: string, trace?: string, meta: Record<string, any> = {}) {
    this.winstonLogger.error(
      message,
      this.sanitizeMetadata({ ...meta, trace }),
    );
  }

  warn(message: string, meta: Record<string, any> = {}) {
    this.winstonLogger.warn(message, this.sanitizeMetadata(meta));
  }

  debug(message: string, meta: Record<string, any> = {}) {
    this.winstonLogger.debug(message, this.sanitizeMetadata(meta));
  }

  private sanitizeMetadata(meta: Record<string, any>) {
    return {
      context: this.context,
      ...this.sanitizeObject(meta),
    };
  }

  private sanitizeObject(obj: any): any {
    if (!obj) return obj;

    if (obj instanceof Error) {
      return {
        message: obj.message,
        stack: obj.stack,
      };
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => this.sanitizeObject(item));
    }

    if (typeof obj === 'object') {
      const sanitized: Record<string, any> = {};
      for (const [key, value] of Object.entries(obj)) {
        // Skip known problematic properties that might contain circular references
        if (
          key === 'req' ||
          key === 'res' ||
          key === 'request' ||
          key === 'response' ||
          key === 'socket' ||
          key === 'parser'
        ) {
          continue;
        }
        sanitized[key] = this.sanitizeObject(value);
      }
      return sanitized;
    }

    return obj;
  }

  logRequest(req: Request, res: Response, duration: number) {
    this.log('HTTP Request', {
      method: req.method,
      url: req.url,
      duration: `${duration}ms`,
      statusCode: res.statusCode,
      userAgent: req.get('user-agent'),
      ip: req.ip,
      // Add any other safe request properties you want to log
      query: req.query,
      params: req.params,
      headers: this.sanitizeHeaders(req.headers),
    });
  }

  private sanitizeHeaders(headers: Record<string, any>) {
    // Remove sensitive headers
    const sanitizedHeaders = { ...headers };
    const sensitiveHeaders = ['authorization', 'cookie', 'x-auth-token'];
    sensitiveHeaders.forEach((header) => delete sanitizedHeaders[header]);
    return sanitizedHeaders;
  }

  logMethodCall(
    className: string,
    methodName: string,
    args: any[],
    duration: number,
    error?: Error,
  ) {
    const meta = {
      className,
      methodName,
      arguments: this.sanitizeObject(args),
      duration: `${duration}ms`,
    };

    if (error) {
      this.error(
        `Method execution failed: ${className}.${methodName}`,
        error.stack,
        { ...meta, error: this.sanitizeObject(error) },
      );
    } else {
      this.log(`Method executed: ${className}.${methodName}`, meta);
    }
  }
}
