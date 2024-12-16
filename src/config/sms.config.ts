import { registerAs } from '@nestjs/config';
import { IsNotEmpty, IsString, ValidateIf } from 'class-validator';
import { appConfig } from './app.config';
import { Environments } from 'src/common/enums/environments.enum';

export const smsConfig = registerAs('sms', () => ({
  apiKey: process.env.SMS_TOKEN,
  clientId: process.env.SMS_CLIENT_ID,
  confirmTemplate: process.env.SMS_CONFIRM_CODE_TEMPLATE,
  forgetTemplate: process.env.SMS_FORGET_CODE_TEMPLATE,
}));

export class SmsEnvSchema {
  @ValidateIf(() => appConfig().nodeEnv !== Environments.TEST)
  @IsString()
  @IsNotEmpty()
  SMS_TOKEN: string;

  @ValidateIf(() => appConfig().nodeEnv !== Environments.TEST)
  @IsString()
  @IsNotEmpty()
  SMS_CONFIRM_CODE_TEMPLATE: string;

  @ValidateIf(() => appConfig().nodeEnv !== Environments.TEST)
  @IsString()
  @IsNotEmpty()
  SMS_FORGET_CODE_TEMPLATE: string;
}
