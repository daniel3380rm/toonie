import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { CachingService } from '../../../../common/caching/caching.service';
import { RedisKeys } from '../../../../common/caching/redis-keys.constant';
import { AuthenticationErrors } from '../enums/authentication-messages.enum';

@Injectable()
export class ForgetPasswordTemporaryGuard implements CanActivate {
  constructor(private readonly cachingService: CachingService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    const authHeader = request.headers['temporary-token'];

    if (!authHeader)
      throw new UnauthorizedException(AuthenticationErrors.INVALID_TOKEN);

    const decodedAuthHeader = atob(authHeader);

    const [key, token] = decodedAuthHeader.split(':');
    if (!key || !token)
      throw new UnauthorizedException(AuthenticationErrors.INVALID_TOKEN);

    const { name } = RedisKeys.forgetPasswordTempToken(Number(key));
    const tokenFound = await this.cachingService.get(name);
    if (tokenFound !== token)
      throw new UnauthorizedException(AuthenticationErrors.INVALID_TOKEN);

    request.tempKey = key;

    return true;
  }
}
