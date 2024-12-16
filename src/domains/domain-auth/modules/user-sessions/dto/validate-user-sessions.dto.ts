import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'src/common/decorators/validation/default';
import { IsId } from 'src/common/decorators/validation';

export class ValidateUserSessionsDto {
  @ApiProperty({ example: '' })
  @IsId()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({ example: '' })
  @IsNotEmpty()
  device: string;

  @ApiProperty({ example: '' })
  @IsNotEmpty()
  hosts: string;

  @ApiProperty({ example: '1' })
  @IsNotEmpty()
  token: string;
}
