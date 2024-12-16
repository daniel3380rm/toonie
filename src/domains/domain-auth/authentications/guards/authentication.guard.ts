import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard as PassportAuthGuard } from '@nestjs/passport';
import * as DeviceDetector from 'device-detector-js';
import { UserSessionsService } from '../../modules/user-sessions/services/user-sessions.service';
import { AuthenticationDecorators } from '../enums/authentication-decorators.enum';
import { UsersProfileDecoratorsEnum } from '../../../domain-member/user-profiles/enums/users-profile-decorators.enum';
import { UsersProfileException } from '../../../domain-member/user-profiles/exceptions/users-profile.exception';
import { UsersProfileMessagesEnum } from '../../../domain-member/user-profiles/enums/users-profile-messages.enum';

@Injectable()
export class AuthGuard extends PassportAuthGuard('jwt') {
  private deviceDetector: DeviceDetector;
  constructor(
    private readonly reflector: Reflector,
    private readonly userSessionsService: UserSessionsService,
  ) {
    super();
    this.deviceDetector = new DeviceDetector();
  }

  async canActivate(context: ExecutionContext) {
    const ctx = context.switchToHttp().getRequest();
    let token = ctx.headers['authorization'];

    let ip =
      ctx.headers['x-forwarded-for'] ||
      ctx.connection.remoteAddress ||
      ctx.socket.remoteAddress ||
      ctx.connection.socket.remoteAddress;
    ip = ip.split(',')[0];
    ip = ip.split(':').slice(-1)[0];

    const userAgents = ctx.headers['User-Agent'] || ctx.headers['user-agent'];

    const agents = this.deviceDetector.parse(userAgents);
    const device = [
      agents?.device?.type,
      agents?.device?.brand,
      agents?.device?.model,
    ].join('|');
    let user: any;

    token =
      token &&
      token.split(' ').length === 2 &&
      (token.split(' ')[0] === 'Bearer' ? token : null);

    const isPublic = this.isPublic(context);
    const isProfileRequired = this.isProfileRequired(context);

    if (!isPublic || (isPublic && token)) {
      await super.canActivate(context);
      user = ctx?.user;
      const session = await this.userSessionsService.findOneWithSessionInfo({
        userId: user.id,
        hosts: ip,
        device,
        token: token.split(' ')[1],
      });

      if (!session) return false;

      ctx['device'] = device;
      ctx['session'] = session;
    }

    if (isProfileRequired) {
      const request = context.switchToHttp().getRequest();
      if (!request.user && (!request.user.profile || !request.user.admin)) {
        UsersProfileException.notFound(UsersProfileMessagesEnum.NOT_FOUND);
      }
    }
    return true;
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

  private isProfileRequired(context: ExecutionContext): boolean {
    const isProfileRequiredForEndpoint = this.reflector.get<boolean>(
      UsersProfileDecoratorsEnum.IS_PROFILE_REQUIRED,
      context.getHandler(),
    );
    const isProfileRequiredForController = this.reflector.get<boolean>(
      UsersProfileDecoratorsEnum.IS_PROFILE_REQUIRED,
      context.getClass(),
    );
    return isProfileRequiredForEndpoint || isProfileRequiredForController;
  }
}
