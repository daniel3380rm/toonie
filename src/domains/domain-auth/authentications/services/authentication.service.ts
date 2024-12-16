import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserErrors } from '../../users/enums/user-messages.enum';
import { AuthHelperService } from './auth-helper.service';
import { AuthTwoFAService } from './auth-2fa.service';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { AuthOtpService } from './auth-otp.service';
import { ChangeCredentialSendCodeDto } from '../dto/change-credential-send-code.dto';
import { ChangeCredentialVerifyDto } from '../dto/change-credential-verify.dto';
import { SocialInterface } from 'src/domains/domain-auth/modules/auth-google/interfaces/social.interface';
import { UserEntity } from 'src/domains/domain-auth/users/entities/user.entity';
import { UsersService } from '../../users/services/users.service';
import { UserSessionsService } from '../../modules/user-sessions/services/user-sessions.service';
import { UserDevicesService } from '../../../domain-member/user-devices/user-devices.service';
import { AuthLoginDto } from '../dto/authentication-login.dto';
import { AuthenticationLoginStep } from '../enums/authentication-login-step.enum';
import { AuthenticationErrors } from '../enums/authentication-messages.enum';
import { AuthenticationDto } from '../dto/authentication.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private userSessionsService: UserSessionsService,
    private userDevicesService: UserDevicesService,
    private authHelperService: AuthHelperService,
    private authTwoFAService: AuthTwoFAService,
    private authOtpService: AuthOtpService,
  ) {}

  async loginWithPassword(
    { email, phoneNumber, password }: AuthLoginDto,
    userAgents: string,
    ip: string,
  ): Promise<{ status: AuthenticationLoginStep; data: any }> {
    const userFound = email
      ? await this.usersService.findByEmailAndActive(email, true)
      : await this.usersService.findByPhoneNumberAndActive(phoneNumber, true);

    if (!userFound || !userFound.password)
      throw new NotFoundException(UserErrors.INCORRECT_USER_PASSWORD);

    const result = await userFound.isPasswordCorrect(password);
    if (!result)
      throw new NotFoundException(UserErrors.INCORRECT_USER_PASSWORD);

    return await this.authTwoFAService.checkUser2FAStatus(
      userFound.twoFAType,
      true,
      userFound,
      ip,
      userAgents,
    );
  }

  async refreshToken(refreshToken: string, userAgents: string, ip: string) {
    const userSession = await this.userSessionsService.findOneByTokenAndUserId(
      refreshToken,
    );

    if (!userSession)
      throw new UnauthorizedException(AuthenticationErrors.INVALID_TOKEN);

    const data = await this.authHelperService.generateSession(
      userSession.userId,
      false,
      ip,
      userAgents,
    );

    await this.authHelperService.updateLastLogin(userSession.id);
    return new AuthenticationDto({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    });
  }

  async validateSocialLogin(
    authProvider: string,
    socialData: SocialInterface,
    userAgents: string,
    ip: string,
  ) {
    let userFound: UserEntity;
    const socialEmail = socialData.email?.toLowerCase();

    const userByEmail = await this.usersService.findOne({
      email: socialEmail,
    });

    userFound = await this.usersService.findOne({
      socialId: socialData.id,
      provider: authProvider,
    });

    if (userFound) {
      if (socialEmail && !userByEmail) {
        userFound.email = socialEmail;
      }
      await this.usersService.update(userFound.id, userFound);
    } else if (userByEmail) {
      userFound = userByEmail;
    } else {
      userFound = await this.usersService.create({
        email: socialEmail,
        socialId: socialData.id,
        provider: authProvider,
      });

      userFound = await this.usersService.findOne({
        id: userFound.id,
      });

      await this.userDevicesService.create(userFound.id);
    }

    const { accessToken, refreshToken, session } =
      await this.authHelperService.generateSession(
        userFound.id,
        true,
        ip,
        userAgents,
      );

    await this.authHelperService.updateLastLogin(session.id);
    return new AuthenticationDto({
      accessToken,
      refreshToken,
      session,
      user: userFound,
    });
  }

  async changePassword(
    userId: number,
    { oldPassword, newPassword }: ChangePasswordDto,
  ) {
    const userFound = await this.usersService.findOne({ id: userId });

    if (!userFound && !userFound.password)
      throw new NotFoundException(UserErrors.NOT_FOUND);

    const isCompared = await userFound.isPasswordCorrect(oldPassword);
    if (!isCompared) throw new NotFoundException(UserErrors.NOT_FOUND);

    userFound.password = newPassword;
    await userFound.save();
  }

  async changeCredentials(
    userId: number,
    { email, phoneNumber }: ChangeCredentialSendCodeDto,
  ) {
    let result: any;

    const userFound = await this.usersService.findOne({ id: userId });

    if (!userFound) throw new NotFoundException(UserErrors.NOT_FOUND);

    if (phoneNumber) {
      const code = await this.authOtpService.setOtpVerification(phoneNumber);
      result = await this.authOtpService.sendOtpVerification(code, phoneNumber);
    } else {
      const code = await this.authOtpService.setOtpVerification(
        undefined,
        email,
      );
      result = await this.authOtpService.sendOtpVerification(
        code,
        undefined,
        email,
      );
    }

    return result;
  }

  async verifyChangedCredentials(
    userId: number,
    { email, phoneNumber, code }: ChangeCredentialVerifyDto,
  ) {
    const userFound = await this.usersService.findOne({ id: userId });

    if (!userFound) throw new NotFoundException(UserErrors.NOT_FOUND);
    if (phoneNumber) {
      await this.authOtpService.isOtpVerificationCorrect(code, phoneNumber);
      userFound.phoneNumber = phoneNumber;
    } else {
      await this.authOtpService.isOtpVerificationCorrect(
        code,
        undefined,
        email,
      );
      userFound.email = email;
    }
    await userFound.save();
  }
}
