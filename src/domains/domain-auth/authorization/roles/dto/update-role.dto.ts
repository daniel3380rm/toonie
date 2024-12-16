import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { CustomIsString, IsId } from 'src/common/decorators/validation';

export class UpdateRoleDto {
  @ApiProperty({ example: 'support' })
  @CustomIsString({ optional: true })
  name?: string;

  @ApiProperty({ example: [1] })
  @IsId({ each: true })
  @IsOptional()
  permissionIds?: number[];

  metadata: any;
}
