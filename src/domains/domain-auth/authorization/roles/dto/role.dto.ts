import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseResponse } from 'src/common/dto/response/base-response.dto';
import { PermissionDto } from '../../permission/dto/permission.dto';

export class RoleDto extends BaseResponse {
  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  key?: string;

  @ApiProperty({ type: [PermissionDto] })
  permissions: PermissionDto[];

  @ApiProperty()
  usersCount?: number;

  constructor(init: Partial<RoleDto & { usersCount: number }>) {
    super(init);
    this.name = init.name;
    this.key = init.key;
    this.permissions =
      init.permissions && init.permissions.length
        ? init.permissions.map((permission) => new PermissionDto(permission))
        : [];
    this.usersCount = init.usersCount || 0;
  }
}
