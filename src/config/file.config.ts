import { registerAs } from '@nestjs/config';
import { IsString, IsOptional, IsNumberString } from 'class-validator';

export const fileConfig = registerAs('file', () => ({
  driver: process.env.FILE_DRIVER,
  maxFileSize: process.env.FILE_SIZE,
}));

export class FileEnvSchema {
  @IsString()
  @IsOptional()
  FILE_DRIVER: string;

  @IsNumberString()
  @IsOptional()
  FILE_SIZE: string;
}
