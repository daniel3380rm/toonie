import { ApiProperty } from '@nestjs/swagger';
import { IsPassword } from 'src/common/decorators/validation';

export class ChangeForgetPasswordDto {
  @ApiProperty()
  @IsPassword()
  password: string;
}
