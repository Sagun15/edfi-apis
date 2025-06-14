import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const IfMatch = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): string => {
        const request = ctx.switchToHttp().getRequest();
        return request.headers['if-match'];
    },
);

export const IfNoneMatch = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): string => {
        const request = ctx.switchToHttp().getRequest();
        return request.headers['if-none-match'];
    },
);