import { registerAs } from '@nestjs/config';
import { IsString } from 'class-validator';

export const swaggerConfig = registerAs('swagger', () => ({
  url: process.env.SWAGGER_DOCUMENT_URL || 'docs',
}));

export class SwaggerEnvSchema {
  @IsString()
  SWAGGER_DOCUMENT_URL: string;
}
