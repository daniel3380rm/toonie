import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumberString,
  IsString,
} from 'src/common/decorators/validation/default';
import { ValidateIf } from 'class-validator';
import { ExactLength } from 'src/common/decorators/validation';
import { ValidationConstraints } from '../../../../common/constants/validation-constraints.const';

export class ChangeCredentialVerifyDto {
  @ApiPropertyOptional()
  // @IsPhoneNumber()
  @IsString()
  @ValidateIf((o) => !o.email)
  phoneNumber: string;

  @ApiPropertyOptional()
  // @IsEmail({})
  @IsString()
  @ValidateIf((o) => !o.phoneNumber)
  email: string;

  @ApiProperty({ example: '1234' })
  @IsNumberString()
  @ExactLength(ValidationConstraints.otpCodeLength)
  code: string;
}
