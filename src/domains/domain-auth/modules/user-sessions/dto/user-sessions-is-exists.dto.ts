import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'src/common/decorators/validation/default';
import { IsId } from 'src/common/decorators/validation';

export class UserSessionsIsExistsDto {
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
}
