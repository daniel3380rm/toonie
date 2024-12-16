import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'src/common/decorators/validation/default';

export class AuthOtpConfirmDto {
  @ApiProperty({ example: '09121234567' })
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @ApiProperty({ example: '1234' })
  @IsNotEmpty()
  code: string;
}
