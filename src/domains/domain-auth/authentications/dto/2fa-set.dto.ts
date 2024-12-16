import { ApiProperty } from '@nestjs/swagger';
import { User2FAType } from '../../users/enums/user-2fa-type.enum';
import { IsEnum } from 'class-validator';
import { IsNumberString } from '../../../../common/decorators/validation/default';
import { ExactLength } from '../../../../common/decorators/validation';
import { ValidationConstraints } from '../../../../common/constants/validation-constraints.const';

export class TwoFASetDto {
  @ApiProperty({ enum: User2FAType })
  @IsEnum(User2FAType)
  twoFAType: User2FAType;

  @ApiProperty({ example: '1234' })
  @IsNumberString()
  @ExactLength(ValidationConstraints.otpCodeLength)
  code: string;
}
