import { ApiProperty } from '@nestjs/swagger';
import { IsId } from 'src/common/decorators/validation';
import { CreateTokenDto } from './create-token.dto';
import { IsNotEmpty } from 'src/common/decorators/validation/default';

export class CreateUserSessionsDto {
  @ApiProperty({ example: '' })
  @IsId()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({ example: '' })
  @IsNotEmpty()
  hosts: string;

  @ApiProperty({ example: '' })
  @IsNotEmpty()
  agents: string;

  @ApiProperty({ example: '1' })
  @IsNotEmpty()
  tokens: CreateTokenDto[];
}
