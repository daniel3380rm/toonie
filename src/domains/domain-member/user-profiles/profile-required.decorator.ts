import { SetMetadata } from '@nestjs/common';
import { UsersProfileDecoratorsEnum } from './enums/users-profile-decorators.enum';
export const ProfileRequired = () =>
  SetMetadata(UsersProfileDecoratorsEnum.IS_PROFILE_REQUIRED, true);
