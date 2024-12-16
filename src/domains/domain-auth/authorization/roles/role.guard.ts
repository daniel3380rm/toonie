import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const roles = this.reflector.getAllAndOverride<number[]>('role', [
      context.getClass(),
      context.getHandler(),
    ]);
    if (!roles) {
      return true;
    }
    // console.log(request.user.roles);
    // console.log(roles);
    // console.log(roles.includes(request.user.roles.id));
    return roles.some((requiredRole) =>
      request.user.roles.some((userRole) => userRole.id === requiredRole),
    );
    // return roles.includes(request.user?.role?.id);
  }
}
