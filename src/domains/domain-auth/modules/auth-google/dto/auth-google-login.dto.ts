import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'src/common/decorators/validation/default';
export class AuthGoogleLoginDto {
  @ApiProperty({ example: 'abc' })
  @IsNotEmpty()
  idToken: string;
}
