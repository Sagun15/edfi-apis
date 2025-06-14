import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Request } from 'express';
import { ApplicationAPIException } from './ApplicationAPIException';
import {
  CodeMajor,
  CodeMinor,
  ApplicationErrorResponse,
  Severity,
  ImsxCodeMinor,
  ImsxCodeMinorField,
} from '../types/errorTypes';
import { ERROR_MESSAGES } from '../constants/constants';
import { CustomLogger } from '../utils/logger/logger.service';

/**
 * Application Global Exception Filter
 *
 * A global exception filter that catches all exceptions thrown within the application
 * and transforms them into standardized error responses.
 * This ensures consistent error handling and follows the IMS Global specification
 * for error responses.
 *
 * @implements {ExceptionFilter}
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new CustomLogger();

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  /**
   * Catches and processes all exceptions thrown within the application.
   * Transforms various types of exceptions into error responses.
   *
   * @param {unknown} exception - The caught exception
   * @param {ArgumentsHost} host - The arguments host containing the HTTP context
   * @returns {void}
   *
   * @throws {Error} If there's a critical error in the error handling process itself
   */
  catch(exception: unknown, host: ArgumentsHost): void {
    // Get the HTTP adapter from the host
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse();

    // Log the exception with context
    this.logException(exception, request);

    let responseBody: ApplicationErrorResponse;
    let statusCode: number;

    if (exception instanceof ApplicationAPIException) {
      statusCode = exception.getStatus();
      responseBody = exception.getResponse() as ApplicationErrorResponse;
    } else if (exception instanceof HttpException) {
      statusCode = exception.getStatus();

      // Check if this is a validation error from ValidationPipe
      const exceptionResponse = exception.getResponse();

      if (
        statusCode === HttpStatus.BAD_REQUEST &&
        typeof exceptionResponse === 'object' &&
        'message' in exceptionResponse
      ) {
        const validationErrors = Array.isArray(exceptionResponse.message)
          ? exceptionResponse.message.join(', ')
          : typeof exceptionResponse.message === 'string'
            ? exceptionResponse.message
            : 'Validation failed';

        responseBody = this.createApplicationResponse(
          validationErrors,
          statusCode,
          CodeMinor.InvalidRequestBody,
        );
      } else {
        // Handle other HTTP exceptions
        responseBody = this.createApplicationResponse(
          exception.message,
          statusCode,
          this.getCodeMinorForHttpStatus(statusCode),
        );
      }
    } else {
      // Handle unknown errors
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      responseBody = this.createApplicationResponse(
        ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        statusCode,
        CodeMinor.InternalServerError,
      );
    }

    // Send the response
    httpAdapter.reply(response, responseBody, statusCode);
  }

  /**
   * Logs exception details with contextual information about the request.
   *
   * @param {unknown} exception - The exception to log
   * @param {Request} request - The HTTP request that triggered the exception
   * @returns {void}
   */
  private logException(exception: unknown, request: Request): void {
    const errorContext = {
      path: request.path,
      method: request.method,
      body: request.body,
      query: request.query,
      timestamp: new Date().toISOString(),
    };

    if (exception instanceof Error) {
      this.logger.error(
        `Exception: ${exception.message}`,
        exception.stack,
        errorContext,
      );
    } else {
      this.logger.error(
        'Unknown exception occurred',
        JSON.stringify(exception),
        errorContext,
      );
    }
  }

  /**
   * Creates a standardized error response object.
   *
   * @param {string} description - Human-readable description of the error
   * @param {number} status - HTTP status code
   * @param {CodeMinor} codeMinor - Specific error code from specification
   * @returns {ApplicationErrorResponse} Formatted error response
   */
  private createApplicationResponse(
    description: string,
    status: number,
    codeMinor: CodeMinor,
  ): ApplicationErrorResponse {
    const codeMinorField: ImsxCodeMinorField = {
      codeMinorFieldName: 'TargetEndSystem',
      codeMinorFieldValue: codeMinor,
    };

    const imsxCodeMinor: ImsxCodeMinor = {
      codeMinorField: [codeMinorField],
    };

    return {
      description: description
    };
  }

  /**
   * Determines the code major based on HTTP status code.
   *
   * @param {number} status - HTTP status code
   * @returns {CodeMajor} Appropriate code major
   */
  private getCodeMajorForHttpStatus(status: number): CodeMajor {
    return status < 400 ? CodeMajor.Success : CodeMajor.Failure;
  }

  /**
   * Determines the severity based on HTTP status code.
   *
   * @param {number} status - HTTP status code
   * @returns {Severity} Appropriate severity level
   */
  private getSeverityForHttpStatus(status: number): Severity {
    if (status < 400) return Severity.Status;
    return Severity.Error;
  }

  /**
   * Maps HTTP status codes to code minor values.
   *
   * @param {number} status - HTTP status code
   * @returns {CodeMinor} Appropriate code minor
   */
  private getCodeMinorForHttpStatus(status: number): CodeMinor {
    switch (status) {
      case HttpStatus.BAD_REQUEST:
        return CodeMinor.BadRequest;
      case HttpStatus.UNAUTHORIZED:
        return CodeMinor.UnauthorizedRequest;
      case HttpStatus.FORBIDDEN:
        return CodeMinor.Forbidden;
      case HttpStatus.NOT_FOUND:
        return CodeMinor.UnknownObject;
      case HttpStatus.SERVICE_UNAVAILABLE:
        return CodeMinor.ServerBusy;
      case HttpStatus.UNPROCESSABLE_ENTITY:
        return CodeMinor.InvalidRequestBody;
      default:
        return CodeMinor.InternalServerError;
    }
  }
}
