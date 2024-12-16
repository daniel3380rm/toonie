import { ApiPropertyOptional } from '@nestjs/swagger';
import { ValidateIf } from 'class-validator';
import { IsString } from 'src/common/decorators/validation/default';

export class AuthOtpLoginDto {
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
}
