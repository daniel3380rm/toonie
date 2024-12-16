import { registerAs } from '@nestjs/config';
import {
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { appConfig } from './app.config';
import { Environments } from 'src/common/enums/environments.enum';

export const recaptchaConfig = registerAs('recaptcha', () => ({
  secret: process.env.RECAPTCHA_SECRET,
  verifyUrl: process.env.RECAPTCHA_VERIFY_URL,
  executionAfterTtl:
    parseInt(process.env.RECAPTCHA_EXECUTION_AFTER_TTL) || 60 * 60,
}));

export class RecaptchaEnvSchema {
  @ValidateIf(() => appConfig().nodeEnv !== Environments.TEST)
  @IsString()
  @IsNotEmpty()
  RECAPTCHA_SECRET: string;

  @IsString()
  @IsNotEmpty()
  RECAPTCHA_VERIFY_URL: string;

  @IsNumberString()
  @IsOptional()
  RECAPTCHA_EXECUTION_AFTER_TTL: string;
}
