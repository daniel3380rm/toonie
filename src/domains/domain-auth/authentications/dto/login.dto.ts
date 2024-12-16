import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, ValidateIf } from 'class-validator';
import {
  CustomIsString,
  IsIRPhoneNumber,
} from '../../../../common/decorators/validation';
import { IsEmail } from '../../../../common/decorators/validation/default';

export class LoginDto {
  @ApiProperty({ example: 'admin@pultex.ir' })
  @IsEmail({})
  @IsOptional()
  email: string;

  @ApiProperty({ example: '09123456789' })
  @ValidateIf((o) => !o.email)
  @IsIRPhoneNumber()
  phoneNumber: string;

  @ApiProperty({ example: '12345678a' })
  @CustomIsString()
  password: string;
}
