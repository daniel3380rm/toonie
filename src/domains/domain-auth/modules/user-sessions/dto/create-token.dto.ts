import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'src/common/decorators/validation/default';
import { TokenType } from '../enums/token-type.enum';

export class CreateTokenDto {
  @ApiProperty({ example: '1' })
  @IsNotEmpty()
  token: string;

  @ApiProperty({ example: TokenType })
  @IsNotEmpty()
  tokenType: TokenType;
}
