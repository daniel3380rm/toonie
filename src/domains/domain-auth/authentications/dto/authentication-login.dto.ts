import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ValidateIf } from 'class-validator';
import { IsNotEmpty, IsString } from 'src/common/decorators/validation/default';

export class AuthLoginDto {
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
  @IsNotEmpty()
  password: string;
}
