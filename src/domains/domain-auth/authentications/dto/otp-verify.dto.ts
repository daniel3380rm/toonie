import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, ValidateIf } from 'class-validator';
import {
  IsNumberString,
  IsString,
} from '../../../../common/decorators/validation/default';
import {
  ExactLength,
  IsPassword,
} from '../../../../common/decorators/validation';
import { ValidationConstraints } from '../../../../common/constants/validation-constraints.const';

export class OtpVerifyDto {
  @ApiPropertyOptional()
  // @IsPhoneNumber()
  @IsString()
  @IsOptional()
  @ValidateIf((o) => !o.phoneNumber)
  phoneNumber: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @ValidateIf((o) => !o.email)
  email: string;

  @ApiProperty({ example: '1234' })
  @IsNumberString()
  @ExactLength(ValidationConstraints.otpCodeLength)
  code: string;

  @ApiProperty()
  @IsPassword()
  @IsOptional()
  password: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  referralCode: string;
}
