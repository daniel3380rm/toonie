import { ApiProperty } from '@nestjs/swagger';
import { IsId } from 'src/common/decorators/validation';
import { IsNotEmpty } from '../../../../../common/decorators/validation/default';

export class UserSessionsInfoDto {
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
