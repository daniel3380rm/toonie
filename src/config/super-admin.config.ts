import { registerAs } from '@nestjs/config';
import { IsEmail, IsNotEmpty, IsNumberString, IsString } from 'class-validator';
import { IsIRPhoneNumber } from 'src/common/decorators/validation';

export const superAdminConfig = registerAs('superAdmin', () => ({
  id: parseInt(process.env.SUPER_ADMIN_ID),
  phoneNumber: process.env.SUPER_ADMIN_PHONE_NUMBER,
  email: process.env.SUPER_ADMIN_EMAIL,
  firstName: process.env.SUPER_ADMIN_FIRST_NAME,
  lastName: process.env.SUPER_ADMIN_LAST_NAME,
  password: process.env.SUPER_ADMIN_PASSWORD,
}));

export class SuperAdminEnvSchema {
  @IsNumberString()
  @IsNotEmpty()
  SUPER_ADMIN_ID: string;

  @IsIRPhoneNumber()
  @IsNotEmpty()
  SUPER_ADMIN_PHONE_NUMBER: string;

  @IsEmail()
  @IsNotEmpty()
  SUPER_ADMIN_EMAIL: string;

  @IsString()
  @IsNotEmpty()
  SUPER_ADMIN_FIRST_NAME: string;

  @IsString()
  @IsNotEmpty()
  SUPER_ADMIN_LAST_NAME: string;

  @IsString()
  @IsNotEmpty()
  SUPER_ADMIN_PASSWORD: string;
}
