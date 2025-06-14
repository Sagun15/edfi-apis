import { Injectable, PipeTransform, ExecutionContext } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { AbstractHttpResponse } from '../dto/response/abstractResponse.dto';

/**
 * Pipe for allowing a platform-agnostic http response to be created
 */
@Injectable()
export class ExecutionContextToAbstractResponsePipe implements PipeTransform {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  transform(ctx: ExecutionContext): AbstractHttpResponse {
    return new AbstractHttpResponse(this.httpAdapterHost.httpAdapter, ctx);
  }
}
