import { SetMetadata } from '@nestjs/common';

export const PermissionType = (...permission: string[]) =>
  SetMetadata('permission', permission);
