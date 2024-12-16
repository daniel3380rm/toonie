import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { IsId } from 'src/common/decorators/validation';
import { CreateTokenDto } from './create-token.dto';

export class UpdateUserSessionsDto {
  @ApiProperty({ example: '' })
  @IsId()
  @IsOptional()
  userId?: number;

  @ApiProperty({ example: '' })
  @IsOptional()
  hosts?: string;

  @ApiProperty({ example: '' })
  @IsOptional()
  agents?: string;

  @ApiProperty({ example: '1' })
  @IsOptional()
  tokens?: CreateTokenDto[];
}
