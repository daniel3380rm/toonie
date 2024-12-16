import { Module } from '@nestjs/common';
import { PermissionModule } from './permission/permission.module';
import { RoleModule } from './roles/role.module';

@Module({
  imports: [RoleModule, PermissionModule],
  exports: [RoleModule, PermissionModule],
})
export class AuthorizationModule {}
