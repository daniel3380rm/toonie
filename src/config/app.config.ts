import { registerAs } from '@nestjs/config';
import { IsString, IsOptional, IsNumberString } from 'class-validator';

export const appConfig = registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV,
  name: process.env.APP_NAME,
  workingDirectory: process.env.PWD || process.cwd(),
  port: parseInt(process.env.APP_PORT || process.env.PORT, 10) || 3000,
  host: process.env.APP_HOST,
  apiPrefix: process.env.API_PREFIX || 'api',
  apiVersion: process.env.API_VERSION || '1',
  hashSaltRounds: parseInt(process.env.HASH_SALT_ROUNDS) || 6,
  fallbackLanguage: process.env.APP_FALLBACK_LANGUAGE || 'en',
  headerLanguage: process.env.APP_HEADER_LANGUAGE || 'accept-language',
}));

export class AppEnvSchema {
  @IsString()
  @IsOptional()
  NODE_ENV: string;

  @IsNumberString()
  @IsOptional()
  APP_NAME: string;

  @IsNumberString()
  @IsOptional()
  APP_PORT: string;

  @IsString()
  @IsOptional()
  API_PREFIX: string;

  @IsString()
  @IsOptional()
  API_VERSION: string;

  @IsNumberString()
  @IsOptional()
  HASH_SALT_ROUNDS: string;

  @IsString()
  @IsOptional()
  BASE_URL: string;

  @IsNumberString()
  @IsOptional()
  RATE_LIMIT_REQUEST_COUNT: string;

  @IsNumberString()
  @IsOptional()
  RATE_LIMIT_TTL: string;

  @IsNumberString()
  @IsOptional()
  REQUEST_SIZE_LIMIT: number;
}
