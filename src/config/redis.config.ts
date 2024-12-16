import { registerAs } from '@nestjs/config';
import {
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export const redisConfig = registerAs('redis', () => ({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD,
  otpCodeTtl: parseInt(process.env.REDIS_OTP_CODE_TTL) || 300,
}));

export class RedisEnvSchema {
  @IsString()
  @IsNotEmpty()
  REDIS_HOST: string;

  @IsNumberString()
  REDIS_PORT: string;

  @IsString()
  @IsOptional()
  REDIS_PASSWORD: string;

  @IsNumberString()
  REDIS_OTP_CODE_TTL: string;
}
