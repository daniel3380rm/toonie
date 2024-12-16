import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'src/common/decorators/validation/default';
import { IsId } from 'src/common/decorators/validation';
import { TokenType } from '../enums/token-type.enum';

export class SessionTokensDto {
  @ApiProperty({ example: '' })
  @IsId()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({ example: '' })
  @IsId()
  @IsNotEmpty()
  sessionId: number;

  @ApiProperty({ example: '' })
  @IsId()
  @IsNotEmpty()
  value: string;

  @ApiProperty({ example: '' })
  @IsNotEmpty()
  type: TokenType;
}
