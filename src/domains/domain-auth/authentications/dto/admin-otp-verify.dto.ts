import { ApiProperty } from '@nestjs/swagger';
import { ValidationConstraints } from '../../../../common/constants/validation-constraints.const';
import {
  ExactLength,
  IsIRPhoneNumber,
} from '../../../../common/decorators/validation';
import {
  IsNotEmpty,
  IsNumberString,
  IsString,
} from '../../../../common/decorators/validation/default';

export class AdminOtpVerifyDto {
  @ApiProperty({ example: '09123456789' })
  @IsIRPhoneNumber()
  phoneNumber: string;

  @ApiProperty({ example: '1234' })
  @IsNumberString()
  @ExactLength(ValidationConstraints.otpCodeLength)
  code: string;

  @ApiProperty({ example: 'firstName' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'lastName' })
  @IsString()
  @IsNotEmpty()
  lastName: string;
}
