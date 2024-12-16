import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString } from '../../../../common/decorators/validation/default';
import { ExactLength } from '../../../../common/decorators/validation';
import { ValidationConstraints } from '../../../../common/constants/validation-constraints.const';

export class TwoFARevokeDto {
  @ApiProperty({ example: '1234' })
  @IsNumberString()
  @ExactLength(ValidationConstraints.otpCodeLength)
  code: string;
}
