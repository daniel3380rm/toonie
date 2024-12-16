import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from 'src/common/dto/response/base-response.dto';

export class UserSessionResponseDto extends BaseResponse {
  @ApiProperty()
  device: string;

  @ApiProperty()
  hosts: string;

  @ApiProperty()
  loggedInAt: Date;

  constructor(init: Partial<UserSessionResponseDto>) {
    super(init);

    this.device = init.device;
    this.hosts = init.hosts;
    this.loggedInAt = init.loggedInAt;
  }
}
