import { ApiProperty } from '@nestjs/swagger';
import { ValidationConstraints } from 'src/common/constants/validation-constraints.const';
import { ForgetPasswordDto } from './forget-password.dto';
import { ExactLength } from '../../../../common/decorators/validation';
import { IsNumberString } from 'class-validator';

export class VerifyForgetPasswordDto extends ForgetPasswordDto {
  @ApiProperty({ example: '123456' })
  @IsNumberString()
  @ExactLength(ValidationConstraints.otpCodeLength)
  code: string;
}
