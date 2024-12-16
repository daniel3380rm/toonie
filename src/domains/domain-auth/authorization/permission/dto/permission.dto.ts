import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from 'src/common/dto/response/base-response.dto';

export class PermissionDto extends BaseResponse {
  @ApiProperty()
  access: string;

  constructor(init: Partial<PermissionDto>) {
    super(init);
    this.access = init.access;
  }
}
