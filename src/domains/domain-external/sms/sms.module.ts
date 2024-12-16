import { Module } from '@nestjs/common';
import { SmsService } from './sms.service';
import { TwilioModule } from '../../../common/lib/twilio';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TwilioModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        accountSid: configService.get('twilio.accountSid'),
        authToken: configService.get('twilio.authToken'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [SmsService],
  exports: [SmsService],
})
export class SmsModule {}
