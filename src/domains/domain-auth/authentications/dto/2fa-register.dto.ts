import { ApiProperty } from '@nestjs/swagger';
import { User2FAType } from '../../users/enums/user-2fa-type.enum';
import { IsEnum } from 'class-validator';

export class TwoFARegisterDto {
  @ApiProperty({ enum: User2FAType })
  @IsEnum(User2FAType)
  twoFAType: User2FAType;
}
