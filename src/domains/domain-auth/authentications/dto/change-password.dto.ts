import { ApiProperty } from '@nestjs/swagger';
import { IsPassword } from 'src/common/decorators/validation';

export class ChangePasswordDto {
  @ApiProperty()
  @IsPassword()
  oldPassword: string;

  @ApiProperty()
  @IsPassword()
  newPassword: string;
}
