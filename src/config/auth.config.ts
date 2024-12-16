import { registerAs } from '@nestjs/config';
import { IsString, IsNotEmpty } from 'class-validator';

export const authConfig = registerAs('auth', () => ({
  accessTokenSecret: process.env.AUTH_ACCESS_TOKEN_SECRET,
  accessTokenExpires: process.env.AUTH_ACCESS_TOKEN_EXPIRES_IN,
  refreshTokenSecret: process.env.AUTH_REFRESH_TOKEN_SECRET,
  refreshTokenExpires: process.env.AUTH_REFRESH_TOKEN_EXPIRES_IN,
  google_clientId: process.env.GOOGLE_CLIENT_ID,
  google_clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  apple_appAudience: process.env.APPLE_APP_AUDIENCE,
}));

export class AuthEnvSchema {
  @IsString()
  @IsNotEmpty()
  AUTH_ACCESS_TOKEN_SECRET: string;

  @IsString()
  @IsNotEmpty()
  AUTH_REFRESH_TOKEN_SECRET: string;

  @IsString()
  @IsNotEmpty()
  AUTH_ACCESS_TOKEN_EXPIRES_IN: string;

  @IsString()
  @IsNotEmpty()
  AUTH_REFRESH_TOKEN_EXPIRES_IN: string;

  @IsString()
  @IsNotEmpty()
  GOOGLE_CLIENT_ID: string;

  @IsString()
  @IsNotEmpty()
  GOOGLE_CLIENT_SECRET: string;

  @IsString()
  @IsNotEmpty()
  APPLE_APP_AUDIENCE: string;
}
