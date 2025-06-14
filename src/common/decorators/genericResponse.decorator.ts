import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AbstractHttpResponse } from '../dto/response/abstractResponse.dto';
import { ExecutionContextToAbstractResponsePipe } from '../pipes/abstractResponse.pipe';

const GetExecutionContext = createParamDecorator(
  (_: never, ctx: ExecutionContext): ExecutionContext => ctx,
);

export const GenericResponse = (): ParameterDecorator =>
  GetExecutionContext(ExecutionContextToAbstractResponsePipe);

export type GenericResponse = AbstractHttpResponse;
