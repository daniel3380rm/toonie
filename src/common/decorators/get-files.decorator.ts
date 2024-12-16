import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetFiles = createParamDecorator(
  (data: number, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.files;
  },
);
