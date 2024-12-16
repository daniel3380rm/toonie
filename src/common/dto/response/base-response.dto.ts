import { ApiProperty } from '@nestjs/swagger';

export class BaseResponse {
  @ApiProperty({ example: 1 })
  public id?: number;

  constructor(init?: Partial<BaseResponse>) {
    this.id = init?.id;
  }
}
