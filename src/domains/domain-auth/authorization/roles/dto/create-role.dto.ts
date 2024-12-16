import { ApiProperty } from '@nestjs/swagger';
import { CustomIsString } from 'src/common/decorators/validation/is-not-empty-string.decorator';
import { IsId } from 'src/common/decorators/validation';

export class CreateRoleDto {
  @ApiProperty({ example: 'support' })
  @CustomIsString()
  name: string;

  @ApiProperty({ example: [1] })
  @IsId({ each: true })
  permissionIds: number[];
}
