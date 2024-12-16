import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AnonymousStrategy } from './strategies/anonymous.strategy';
import { UsersModule } from '../users/users.module';
import { CachingModule } from 'src/common/caching/caching.module';
import { UserSessionModule } from '../modules/user-sessions/user-sessions.module';
import { SmsModule } from 'src/domains/domain-external/sms/sms.module';
import { MailModule } from 'src/domains/domain-external/mail/mail.module';
import { AuthOtpService } from './services/auth-otp.service';
import { ForgetPasswordService } from './services/forget-password.service';
import { AuthHelperService } from './services/auth-helper.service';
import { AuthTwoFAService } from './services/auth-2fa.service';
import { RefreshTokenStrategy } from './strategies/jwt-refresh.strategy';
import { UsersAuthController } from './constrollers/authentication.controller';
import { AuthService } from './services/authentication.service';
import { UserDevicesModule } from '../../domain-member/user-devices/user-devices.module';

@Module({
  imports: [
    UsersModule,
    UserDevicesModule,
    CachingModule,
    UserSessionModule,
    SmsModule,
    MailModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('auth.accessTokenSecret'),
        signOptions: {
          expiresIn: configService.get('auth.accessTokenExpires'),
        },
      }),
    }),
  ],
  controllers: [UsersAuthController],
  providers: [
    AuthService,
    AuthOtpService,
    AuthTwoFAService,
    ForgetPasswordService,
    AuthHelperService,
    JwtStrategy,
    RefreshTokenStrategy,
    AnonymousStrategy,
  ],
  exports: [AuthService],
})
export class AuthenticationsModule {}
