import { registerAs } from '@nestjs/config';
import { IsNotEmpty, IsString, ValidateIf } from 'class-validator';
import { appConfig } from './app.config';
import { Environments } from 'src/common/enums/environments.enum';
import * as process from 'node:process';

export const twilioConfig = registerAs('twilio', () => ({
  accountSid: process.env.TWILIO_ACCOUNT_SID,
  authToken: process.env.TWILIO_AUTH_TOKEN,
  fromNumber: process.env.TWILIO_FROM_NUMBER,
}));

export class TwilioEnvSchema {
  @ValidateIf(() => appConfig().nodeEnv !== Environments.TEST)
  @IsString()
  @IsNotEmpty()
  TWILIO_ACCOUNT_SID: string;

  @ValidateIf(() => appConfig().nodeEnv !== Environments.TEST)
  @IsString()
  @IsNotEmpty()
  TWILIO_AUTH_TOKEN: string;

  @ValidateIf(() => appConfig().nodeEnv !== Environments.TEST)
  @IsString()
  @IsNotEmpty()
  TWILIO_FROM_NUMBER: string;
}
