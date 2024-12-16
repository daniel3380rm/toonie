import { createParamDecorator, ExecutionContext } from '@nestjs/common';
export const GetUserAgents = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const agents =
      request.headers['User-Agent'] || request.headers['user-agent'];
    return agents;
  },
);
