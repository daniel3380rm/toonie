import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ForgetPasswordDto } from '../dto/forget-password.dto';
import { ConfigService } from '@nestjs/config';
import { SmsService } from 'src/domains/domain-external/sms/sms.service';
import { MailService } from 'src/domains/domain-external/mail/mail.service';
import { AuthOtpService } from './auth-otp.service';
import { VerifyForgetPasswordDto } from '../dto/verify-forget-password.dto';
import { AuthHelperService } from './auth-helper.service';
import { CachingService } from '../../../../common/caching/caching.service';
import { generateVerificationCode } from '../../../../common/helper';
import { RedisKeys } from '../../../../common/caching/redis-keys.constant';
import { ValidationConstraints } from '../../../../common/constants/validation-constraints.const';
import { Environments } from '../../../../common/enums/environments.enum';
import { UsersService } from '../../users/services/users.service';
import { AuthenticationErrors } from '../enums/authentication-messages.enum';
import { UserEntity } from '../../users/entities/user.entity';

@Injectable()
export class ForgetPasswordService {
  constructor(
    private cachingService: CachingService,
    private usersService: UsersService,
    private authOtpService: AuthOtpService,
    private authHelperService: AuthHelperService,
    private readonly smsService: SmsService,
    private readonly configService: ConfigService,
    private readonly emailService: MailService,
  ) {}

  async setForgetPasswordCode(userId: number): Promise<string> {
    const code = generateVerificationCode(ValidationConstraints.otpCodeLength);
    const { name, ttl } = RedisKeys.forgetPasswordCode(userId);
    await this.cachingService.set(name, String(code), ttl);
    return code;
  }

  async registerForgetPasswordCode({ phoneNumber, email }: ForgetPasswordDto) {
    let userFound: UserEntity;
    if (phoneNumber) {
      userFound = await this.usersService.findByPhoneNumberAndActive(
        phoneNumber,
        true,
      );
    } else {
      userFound = await this.usersService.findByEmailAndActive(email, true);
    }

    const codeFound =
      await this.authOtpService.getForgetPasswordOtpCodeByUserId(userFound.id);
    console.log('codeFound', codeFound);
    if (codeFound)
      throw new ForbiddenException(
        AuthenticationErrors.FORGET_PASSWORD_CODE_ALREADY_SENT,
      );

    const code = await this.setForgetPasswordCode(userFound.id);
    return await this.sendForgetPasswordCode({
      phoneNumber: userFound.phoneNumber,
      email,
      code,
    });
  }

  async verifyForgetPasswordCode({
    phoneNumber,
    email,
    code,
  }: VerifyForgetPasswordDto) {
    const userFound = email
      ? await this.usersService.findByEmailAndActive(email, true)
      : await this.usersService.findByPhoneNumberAndActive(phoneNumber, true);

    await this.isForgetPasswordCodeCorrect(userFound.id, code);
    const tempToken =
      await this.authHelperService.setForgetPasswordTemporaryToken(
        userFound.id,
      );
    return {
      tempToken: btoa(`${userFound.id}:${tempToken}`),
    };
  }

  async changeForgetPassword(password: string, userId: number) {
    const userFound = await this.usersService.findByIdAndActive(userId, true);
    userFound.password = password;
    await userFound.save();
    return await this.authHelperService.removeForgetPasswordTemporaryToken(
      userId,
    );
  }

  async sendForgetPasswordCode({
    phoneNumber,
    email,
    code,
  }: ForgetPasswordDto & { code: string }) {
    if (this.configService.get('app.nodeEnv') === Environments.RELEASE) {
      if (phoneNumber) {
        await this.smsService.sendForgetCode({
          phoneNumber,
          code,
        });
      } else if (email) {
        await this.emailService.sendForgetCode(email, code);
      }
    } else {
      return { code };
    }
  }

  async sendOtpVerification(
    code: string,
    phoneNumber?: string,
    email?: string,
  ): Promise<{ code?: string }> {
    if (this.configService.get('app.nodeEnv') === Environments.RELEASE) {
      if (phoneNumber) {
        await this.smsService.sendForgetCode({
          phoneNumber,
          code,
        });
      } else if (email) {
        await this.emailService.sendForgetCode(email, code);
      }
    } else {
      return { code };
    }
  }

  async isForgetPasswordCodeCorrect(userId: number, code: string) {
    const { name } = RedisKeys.forgetPasswordCode(userId);
    const codeFound = await this.cachingService.get(name);

    if (codeFound !== code)
      throw new UnauthorizedException(
        AuthenticationErrors.INCORRECT_VERIFICATION_CODE,
      );

    await this.removeForgetPasswordCode(userId);
  }

  private removeForgetPasswordCode(userId: number) {
    const { name } = RedisKeys.forgetPasswordCode(userId);
    return this.cachingService.del(name);
  }
}
