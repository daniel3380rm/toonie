import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Roles } from 'src/domains/domain-auth/authorization/roles/entities/role.entity';

export interface IUser {
  id: number;
  role: Roles;
}

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request?.user ? request?.user : null;
  },
);
