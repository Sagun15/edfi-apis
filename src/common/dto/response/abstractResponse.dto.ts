import type { ExecutionContext } from '@nestjs/common';
import type { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { AbstractHttpAdapter } from '@nestjs/core';

/**
 * Description Abstract class that represents a platform-agnostic Http Response
 */
export class AbstractHttpResponse {
  httpCtx: HttpArgumentsHost;

  /**
   *
   * @param {AbstractHttpAdapter} httpAdapter Injected by NestJS
   * @param {ExecutionContext} executionContext Injected by NestJS
   */
  constructor(
    private readonly httpAdapter: AbstractHttpAdapter,
    readonly executionContext: ExecutionContext,
  ) {
    this.httpCtx = executionContext.switchToHttp();
  }

  /**
   *
   * @param {string} name Name of the header
   * @param {string} value Value of the header
   * @returns {AbstractHttpResponse}
   */
  setHeader(name: string, value: string): this {
    this.httpAdapter.setHeader(this.httpCtx.getResponse(), name, value);
    return this;
  }

  /**
   *
   * @param statusCode The status code of the response
   * @returns {AbstractHttpResponse}
   */
  setStatus(statusCode: number): this {
    this.httpAdapter.status(this.httpCtx.getResponse(), statusCode);
    return this;
  }
}
