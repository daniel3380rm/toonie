import { ApiProperty } from '@nestjs/swagger';
import { ValidationConstraints } from '../../../../common/constants/validation-constraints.const';
import { IsNumberString } from '../../../../common/decorators/validation/default';
import { ExactLength } from 'src/common/decorators/validation/exact-length.decorator';

export class TwoFAVerifyDto {
  @ApiProperty({ example: '1234' })
  @IsNumberString()
  @ExactLength(ValidationConstraints.otpCodeLength)
  code: string;
}
