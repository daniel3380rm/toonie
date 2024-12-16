import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SmsService } from 'src/domains/domain-external/sms/sms.service';
import { MailService } from 'src/domains/domain-external/mail/mail.service';
import { UserEntity } from '../../users/entities/user.entity';
import { OtpVerifyDto } from '../dto/otp-verify.dto';
import { OtpSendCodeDto } from '../dto/otp-send-code.dto';
import { AuthHelperService } from './auth-helper.service';
import { CachingService } from '../../../../common/caching/caching.service';
import { generateVerificationCode } from '../../../../common/helper';
import { ValidationConstraints } from '../../../../common/constants/validation-constraints.const';
import { Environments } from '../../../../common/enums/environments.enum';
import { RedisKeys } from '../../../../common/caching/redis-keys.constant';
import { UsersService } from '../../users/services/users.service';
import { AuthenticationDto } from '../dto/authentication.dto';
import { AuthenticationErrors } from '../enums/authentication-messages.enum';

@Injectable()
export class AuthOtpService {
  constructor(
    private usersService: UsersService,
    private cachingService: CachingService,
    private authHelperService: AuthHelperService,
    private readonly smsService: SmsService,
    private readonly configService: ConfigService,
    private readonly emailService: MailService,
  ) {}

  // TODO: manage use credentials for login
  async loginWithOtp(
    { email, phoneNumber, code, password, referralCode }: OtpVerifyDto,
    userAgents: string,
    ip: string,
  ) {
    let userFound: UserEntity;
    let referralUserId: number;

    if (referralCode) {
      const referralUser = await this.usersService.findOne({
        referralCode: referralCode,
      });
      referralUserId = referralUser?.id;
    }

    if (phoneNumber) {
      await this.isOtpVerificationCorrect(code, phoneNumber);

      userFound = await this.usersService.findByPhoneNumberAndActive(
        phoneNumber,
      );
      console.log(userFound);

      if (!userFound) {
        userFound = await this.usersService.createWithPhoneNumber({
          phoneNumber,
          password,
          referralUserId,
        });
        if (this.configService.get('app.nodeEnv') === Environments.RELEASE) {
          await this.smsService.sendRegistrationMessage(phoneNumber);
        }
      }
    } else {
      await this.isOtpVerificationCorrect(code, undefined, email);

      userFound = await this.usersService.findByEmailAndActive(email);

      if (!userFound) {
        userFound = await this.usersService.createWithEmail({
          email,
          password,
          referralUserId,
        });
        if (this.configService.get('app.nodeEnv') === Environments.RELEASE) {
          await this.emailService.sendRegistrationMessage(email);
        }
      }
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

  async registerWithOtp({ email, phoneNumber }: OtpSendCodeDto) {
    let result: any;

    const codeFound = await this.getOtpCodeByUserData(phoneNumber, email);
    console.log('codeFound', codeFound);
    if (codeFound)
      throw new ForbiddenException(
        AuthenticationErrors.VERIFICATION_CODE_ALREADY_SENT,
      );

    const userFound = email
      ? await this.usersService.findByEmailAndActiveWithProfile(email)
      : await this.usersService.findByPhoneNumberAndActiveWithProfile(
          phoneNumber,
        );

    if (phoneNumber) {
      const code = await this.setOtpVerification(phoneNumber);
      result = await this.sendOtpVerification(code, phoneNumber);
    } else {
      const code = await this.setOtpVerification(undefined, email);
      result = await this.sendOtpVerification(code, undefined, email);
    }

    return { ...result, haveProfile: !!userFound?.profile };
  }

  async twoFASendWithOtp({ email, phoneNumber }: OtpSendCodeDto) {
    let result: any;

    const codeFound = await this.getOtpCodeByUserData(phoneNumber, email);
    console.log('codeFound', codeFound);
    if (codeFound)
      throw new ForbiddenException(
        AuthenticationErrors.VERIFICATION_CODE_ALREADY_SENT,
      );

    if (phoneNumber) {
      const code = await this.setOtpVerification(phoneNumber);
      result = await this.sendOtpVerification(code, phoneNumber);
      result['phoneNumber'] = phoneNumber;
    } else {
      const code = await this.setOtpVerification(undefined, email);
      result = await this.sendOtpVerification(code, undefined, email);
      result['email'] = email;
    }

    return result;
  }

  async setOtpVerification(
    phoneNumber?: string,
    email?: string,
  ): Promise<string> {
    const code = generateVerificationCode(ValidationConstraints.otpCodeLength);
    const redisObject = this.getRedisKey(phoneNumber, email);

    await this.cachingService.set(
      redisObject.name,
      String(code),
      redisObject.ttl,
    );

    return code;
  }

  async sendOtpVerification(
    code: string,
    phoneNumber?: string,
    email?: string,
  ): Promise<{ code?: string }> {
    if (this.configService.get('app.nodeEnv') === Environments.RELEASE) {
      if (phoneNumber) {
        await this.smsService.sendConfirmCode({
          phoneNumber,
          code,
        });
      } else if (email) {
        await this.emailService.sendConfirmCode(email, code);
      }
    } else {
      return { code };
    }
  }

  async isOtpVerificationCorrect(
    code: string,
    phoneNumber?: string,
    email?: string,
  ) {
    const codeFound = await this.getOtpCodeByUserData(phoneNumber, email);

    if (codeFound !== code)
      throw new UnauthorizedException(
        AuthenticationErrors.INCORRECT_VERIFICATION_CODE,
      );

    await this.removeOtpVerification(phoneNumber);
  }

  async getOtpCodeByUserData(phoneNumber: string, email: string) {
    const redisObject = this.getRedisKey(phoneNumber, email);
    console.log(redisObject);
    return await this.cachingService.get(redisObject.name);
  }

  async getForgetPasswordOtpCodeByUserId(userId: number) {
    const redisObject = RedisKeys.forgetPasswordCode(userId);
    console.log(redisObject);
    return await this.cachingService.get(redisObject.name);
  }

  async removeOtpVerification(phoneNumber?: string, email?: string) {
    const redisObject = this.getRedisKey(phoneNumber, email);

    return await this.cachingService.del(redisObject.name);
  }

  private getRedisKey(phoneNumber: string, email: string) {
    return phoneNumber
      ? RedisKeys.phoneNumberVerificationCode(phoneNumber)
      : RedisKeys.emailVerificationCode(email);
  }
}
