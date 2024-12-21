import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, ValidateIf } from 'class-validator';
import { IsString } from 'src/common/decorators/validation/default';

export class OtpSendCodeDto {
  @ApiPropertyOptional()
  // @IsPhoneNumber()
  @IsString()
  @IsOptional()
  @ValidateIf((o) => !o.phoneNumber)
  phoneNumber: string;

  @ApiPropertyOptional()
  // @IsEmail({})
  @IsString()
  @IsOptional()
  @ValidateIf((o) => !o.email)
  email: string;
}
