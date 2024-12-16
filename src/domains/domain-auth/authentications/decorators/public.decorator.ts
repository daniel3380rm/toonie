import { SetMetadata } from '@nestjs/common';
import { AuthenticationDecorators } from '../enums/authentication-decorators.enum';
export const Public = () =>
  SetMetadata(AuthenticationDecorators.IS_PUBLIC, true);
