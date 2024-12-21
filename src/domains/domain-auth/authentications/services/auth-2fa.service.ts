import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from '../../users/entities/user.entity';
import { authenticator } from 'otplib';
import { AuthHelperService } from './auth-helper.service';
import { User2FAType } from '../../users/enums/user-2fa-type.enum';
import { AuthOtpService } from './auth-otp.service';
import { RedisKeys } from '../../../../common/caching/redis-keys.constant';
import { CachingService } from '../../../../common/caching/caching.service';
import { UserSessionsService } from '../../modules/user-sessions/services/user-sessions.service';
import { UsersService } from '../../users/services/users.service';
import { AuthenticationDto } from '../dto/authentication.dto';
import { AuthenticationErrors } from '../enums/authentication-messages.enum';
import { AuthenticationLoginStep } from '../enums/authentication-login-step.enum';

@Injectable()
export class AuthTwoFAService {
  constructor(
    private usersService: UsersService,
    private authHelperService: AuthHelperService,
    private userSessionsService: UserSessionsService,
    private authOtpService: AuthOtpService,
    private cachingService: CachingService,
    private readonly configService: ConfigService,
  ) {}

  async loginWith2fa(user: UserEntity, userAgents: string, ip: string) {
    const { accessToken, refreshToken, session } =
      await this.authHelperService.generateSession(
        user.id,
        true,
        ip,
        userAgents,
      );

    await this.authHelperService.updateLastLogin(session.id);
    return new AuthenticationDto({
      accessToken,
      refreshToken,
      session,
      user: user,
    });
  }

  async generateTwoFactorAuthenticationSecret(user: UserEntity) {
    const secret = authenticator.generateSecret();

    const otpAuthUrl = authenticator.keyuri(
      user.email || user.phoneNumber,
      this.configService.get('app.name'),
      secret,
    );

    return {
      secret,
      otpAuthUrl,
    };
  }

  async isTwoFactorAuthenticationCodeValid(
    twoFactorAuthenticationCode: string,
    secret: string,
  ) {
    const isCodeValid = authenticator.verify({
      token: twoFactorAuthenticationCode,
      secret,
    });
    if (!isCodeValid) {
      throw new UnauthorizedException(
        AuthenticationErrors.INCORRECT_VERIFICATION_CODE,
      );
    }
    return isCodeValid;
  }

  async checkUser2FAStatus(
    twoFAType: User2FAType,
    havSession: boolean,
    user?: UserEntity,
    ip?: string,
    userAgents?: string,
  ): Promise<{
    status: AuthenticationLoginStep;
    twoFAType: User2FAType;
    data: any;
  }> {
    console.log(havSession);

    if ((!twoFAType || twoFAType === User2FAType.NONE) && havSession) {
      const { accessToken, refreshToken, session } =
        await this.authHelperService.generateSession(
          user.id,
          true,
          ip,
          userAgents,
        );

      await this.authHelperService.updateLastLogin(session.id);

      const data = new AuthenticationDto({
        accessToken,
        refreshToken,
        session,
        user,
      });
      return { status: AuthenticationLoginStep.LOGIN, twoFAType, data };
    } else if (twoFAType === User2FAType.GOOGLE) {
      const tempToken = await this.authHelperService.setTwoFATemporaryToken(
        user.id,
      );
      return {
        status: AuthenticationLoginStep.TWO_F_A,
        twoFAType,
        data: {
          tempToken: btoa(`${user.id}:${tempToken}`),
        },
      };
    } else if (
      (!twoFAType && !havSession) ||
      twoFAType === User2FAType.PHONE_NUMBER ||
      twoFAType === User2FAType.EMAIL
    ) {
      const data = await this.authOtpService.twoFASendWithOtp({
        phoneNumber: user?.phoneNumber,
        email: user?.email,
      });

      return {
        status:
          twoFAType === User2FAType.PHONE_NUMBER
            ? AuthenticationLoginStep.OTP_PHONE_NUMBER
            : AuthenticationLoginStep.OTP_EMAIL,
        twoFAType,
        data,
      };
    }
  }

  async register2FA(user: UserEntity, twoFAType: User2FAType) {
    if (twoFAType === User2FAType.NONE) {
      throw new BadRequestException(AuthenticationErrors.INCORRECT_2FA_TYPE);
    }

    if (twoFAType === User2FAType.GOOGLE) {
      if (user.twoFAType === twoFAType || user.twoFAType === User2FAType.NONE) {
        const { otpAuthUrl, secret } =
          await this.generateTwoFactorAuthenticationSecret(user);

        await this.setSecretByUserId(user.id, secret);

        return { otpAuthUrl };
      } else {
        throw new BadRequestException(
          AuthenticationErrors.TWO_FA_METHOD_ALREADY_SET,
        );
      }
    } else if (
      twoFAType === User2FAType.EMAIL ||
      twoFAType === User2FAType.PHONE_NUMBER
    ) {
      if (user.twoFAType === User2FAType.NONE) {
        await this.authOtpService.twoFASendWithOtp({
          phoneNumber: user?.phoneNumber,
          email: user?.email,
        });
      } else {
        throw new BadRequestException(
          AuthenticationErrors.TWO_FA_METHOD_ALREADY_SET,
        );
      }
    } else {
      throw new BadRequestException(AuthenticationErrors.INCORRECT_2FA_TYPE);
    }
  }

  async set2FA(user: UserEntity, twoFAType: User2FAType, code: string) {
    if (twoFAType === User2FAType.NONE) {
      throw new BadRequestException(AuthenticationErrors.INCORRECT_2FA_TYPE);
    }

    if (twoFAType === User2FAType.GOOGLE) {
      if (user.twoFAType === twoFAType || user.twoFAType === User2FAType.NONE) {
        const secret = await this.getSecretByUserId(user.id);
        if (!secret)
          throw new BadRequestException(
            AuthenticationErrors.TWO_FA_METHOD_NOT_SET,
          );
        user.twoFASecret = secret;

        await this.verify2FA(user, twoFAType, code);

        await this.usersService.setTWOFactorAuthentication(
          twoFAType,
          user.id,
          secret,
        );
        await this.removeSecretByUserId(user.id);
      } else {
        throw new BadRequestException(
          AuthenticationErrors.TWO_FA_METHOD_ALREADY_SET,
        );
      }
    } else if (
      twoFAType === User2FAType.EMAIL ||
      twoFAType === User2FAType.PHONE_NUMBER
    ) {
      if (user.twoFAType === User2FAType.NONE) {
        await this.verify2FA(user, twoFAType, code);

        await this.usersService.setTWOFactorAuthentication(
          twoFAType,
          user.id,
          null,
        );
      } else {
        throw new BadRequestException(
          AuthenticationErrors.TWO_FA_METHOD_ALREADY_SET,
        );
      }
    } else {
      throw new BadRequestException(AuthenticationErrors.INCORRECT_2FA_TYPE);
    }
  }

  async revoke2FA(user: UserEntity) {
    if (user.twoFAType === User2FAType.NONE) {
      throw new BadRequestException(AuthenticationErrors.TWO_FA_METHOD_NOT_SET);
    }

    if (
      user.twoFAType === User2FAType.EMAIL ||
      user.twoFAType === User2FAType.PHONE_NUMBER
    ) {
      await this.authOtpService.twoFASendWithOtp({
        phoneNumber: user?.phoneNumber,
        email: user?.email,
      });
    }
  }

  async submitRevoke2FA(user: UserEntity, code: string) {
    await this.verify2FA(user, user.twoFAType, code);

    await this.usersService.setTWOFactorAuthentication(
      User2FAType.NONE,
      user.id,
      null,
    );
  }

  async verify2FA(user: UserEntity, twoFAType: User2FAType, code: string) {
    if (twoFAType === User2FAType.NONE)
      throw new BadRequestException(AuthenticationErrors.TWO_FA_METHOD_NOT_SET);

    if (twoFAType === User2FAType.GOOGLE) {
      await this.isTwoFactorAuthenticationCodeValid(code, user.twoFASecret);
    } else {
      await this.authOtpService.isOtpVerificationCorrect(
        code,
        user.phoneNumber,
        user.email,
      );
      await this.authOtpService.removeOtpVerification(
        user?.phoneNumber,
        user?.email,
      );
    }
  }

  async setSecretByUserId(userId: number, secret: string) {
    const { name, ttl } = RedisKeys.twoFASecret(userId);
    return await this.cachingService.set(name, secret, ttl);
  }

  async getSecretByUserId(userId: number) {
    const { name } = RedisKeys.twoFASecret(userId);
    return await this.cachingService.get(name);
  }

  async removeSecretByUserId(userId: number) {
    const { name } = RedisKeys.twoFASecret(userId);

    return await this.cachingService.del(name);
  }
}
