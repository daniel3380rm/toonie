import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { v4 } from 'uuid';
import { TokenType } from '../../modules/user-sessions/enums/token-type.enum';
import { CachingService } from '../../../../common/caching/caching.service';
import { RedisKeys } from '../../../../common/caching/redis-keys.constant';
import { UserSessionsService } from '../../modules/user-sessions/services/user-sessions.service';
import { UsersService } from '../../users/services/users.service';
import { AuthenticationErrors } from '../enums/authentication-messages.enum';

@Injectable()
export class AuthHelperService {
  constructor(
    private cachingService: CachingService,
    private jwtService: JwtService,
    private userSessionsService: UserSessionsService,
    private usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  async updateLastLogin(sessionId: number) {
    return await this.userSessionsService.updateLastLoginById(sessionId);
  }

  async generateAccessTokenByUserId(userId: number): Promise<string> {
    const accessToken = await this.jwtService.signAsync({
      id: userId,
    });

    return accessToken;
  }

  async generateRefreshTokenByUserId(userId: number): Promise<string> {
    const refreshToken = await this.jwtService.signAsync(
      {
        id: userId,
      },
      {
        secret: this.configService.get('auth.refreshTokenSecret'),
        expiresIn: this.configService.get('auth.refreshTokenExpires'),
      },
    );

    return refreshToken;
  }

  async generateSession(
    userId: number,
    makeNew: boolean,
    ip?: string,
    userAgents?: string,
  ) {
    const accessToken = await this.generateAccessTokenByUserId(userId);
    const refreshToken = await this.generateRefreshTokenByUserId(userId);

    let session = await this.userSessionsService.isExist({
      userId: userId,
      hosts: ip,
      agents: userAgents,
    });

    if (session) {
      session = await this.userSessionsService.update(session.id, {
        userId,
        tokens: [
          {
            token: accessToken,
            tokenType: TokenType.ACCESS_TOKEN,
          },
          {
            token: refreshToken,
            tokenType: TokenType.REFRESh_TOKEN,
          },
        ],
      });
    } else if (!session && makeNew) {
      session = await this.userSessionsService.create({
        userId,
        hosts: ip,
        agents: userAgents,
        tokens: [
          {
            token: accessToken,
            tokenType: TokenType.ACCESS_TOKEN,
          },
          {
            token: refreshToken,
            tokenType: TokenType.REFRESh_TOKEN,
          },
        ],
      });
    } else if (!session && !makeNew) {
      throw new NotFoundException(AuthenticationErrors.NOT_FOUND_SESSION);
    }

    return { accessToken, refreshToken, session };
  }

  async setForgetPasswordTemporaryToken(userId: number): Promise<string> {
    const { name } = RedisKeys.forgetPasswordTempToken(userId);
    const token = v4();
    await this.cachingService.set(name, token);
    return token;
  }

  async removeForgetPasswordTemporaryToken(userId: number) {
    const { name } = RedisKeys.forgetPasswordTempToken(userId);
    await this.cachingService.del(name);
  }

  async setTwoFATemporaryToken(userId: number): Promise<string> {
    const { name } = RedisKeys.twoFATempToken(userId);
    const token = v4();
    await this.cachingService.set(name, token);
    return token;
  }

  async removeTwoFATemporaryToken(userId: number) {
    const { name } = RedisKeys.twoFATempToken(userId);
    await this.cachingService.del(name);
  }
}
