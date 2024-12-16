import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetLanguage = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const alowLanguage = ['en', 'fa'];
    const request = ctx.switchToHttp().getRequest();
    let language = request.headers['accept-language'];
    language = alowLanguage.includes(language) ? language : 'fa';
    return language;
  },
);
