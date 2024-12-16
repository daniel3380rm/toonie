import { registerAs } from '@nestjs/config';
import { IsNotEmpty, IsString, ValidateIf } from 'class-validator';
import { appConfig } from './app.config';
import { Environments } from 'src/common/enums/environments.enum';

export const twilioSendgridConfig = registerAs('sendgrid', () => ({
  apiKey: process.env.TWILIO_SEND_GRID_API_KEY,
  fromEmail: process.env.TWILIO_SEND_GRID_FROM_EMAIL,
}));

export class TwilioSendgridEnvSchema {
  @ValidateIf(() => appConfig().nodeEnv !== Environments.TEST)
  @IsString()
  @IsNotEmpty()
  TWILIO_SEND_GRID_API_KEY: string;

  @ValidateIf(() => appConfig().nodeEnv !== Environments.TEST)
  @IsString()
  @IsNotEmpty()
  TWILIO_SEND_GRID_FROM_EMAIL: string;
}
