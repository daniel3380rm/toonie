import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleService } from '../roles/role.service';
import { PermissionService } from './permission.service';
import { ConfigService } from '@nestjs/config';
import { AuthenticationDecorators } from '../../authentications/enums/authentication-decorators.enum';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly roleService: RoleService,
    private readonly permissionService: PermissionService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('isPublic');

    const isPublic = this.isPublic(context);

    // if (ConfigConstants.app.env === Environments.DEVELOP) return true;
    console.log(isPublic);

    if (isPublic) return true;

    const { id: userId, isAdmin } = context.switchToHttp().getRequest().user;
    console.log(isAdmin);
    if (!isAdmin) return false;

    const endPointPermissions =
      this.reflector.getAllAndOverride<string[]>('permission', [
        context.getClass(),
        context.getHandler(),
      ]) || [];

    if (!endPointPermissions.length) return true;

    const endPointPermission = endPointPermissions[0];
    if (!endPointPermission.length) {
      return true;
    }

    if (userId === this.configService.get('superAdmin.id')) return true;

    const permissionFound = await this.permissionService.findByAccess(
      endPointPermission,
    );
    if (!permissionFound) return false;
    const permissionId = permissionFound.id;

    const userPermissionsFound = await this.roleService.getPermissionsByUserId(
      userId,
    );

    for (const userPermission of userPermissionsFound) {
      if (permissionId === userPermission.id) {
        return true;
      }
    }

    return false;
  }

  private isPublic(context: ExecutionContext): boolean {
    const isPublicForEndpoint = this.reflector.get<boolean>(
      AuthenticationDecorators.IS_PUBLIC,
      context.getHandler(),
    );
    const isPublicForController = this.reflector.get<boolean>(
      AuthenticationDecorators.IS_PUBLIC,
      context.getClass(),
    );
    return isPublicForController || isPublicForEndpoint;
  }
}
