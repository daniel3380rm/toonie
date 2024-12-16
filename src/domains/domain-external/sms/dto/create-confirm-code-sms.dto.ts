import { ApiProperty } from '@nestjs/swagger';
import { ValidationConstraints } from 'src/common/constants/validation-constraints.const';
import { IsString } from 'src/common/decorators/validation/default';
import { ExactLength } from 'src/common/decorators/validation/exact-length.decorator';

export class SendSmsCodeDto {
  @ApiProperty({ example: '091212345678' })
  @IsString()
  phoneNumber: string;

  @ApiProperty({ example: '1234' })
  @ExactLength(ValidationConstraints.otpCodeLength)
  @IsString()
  code: string;
}
