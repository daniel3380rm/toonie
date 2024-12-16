import { ApiProperty } from '@nestjs/swagger';
import { Allow } from 'class-validator';
import { IsNotEmpty } from 'src/common/decorators/validation/default';

export class AuthAppleLoginDto {
  @ApiProperty({ example: 'abc' })
  @IsNotEmpty()
  idToken: string;

  @Allow()
  @ApiProperty({ required: false })
  firstName?: string;

  @Allow()
  @ApiProperty({ required: false })
  lastName?: string;
}
