import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseResponse } from './base-response.dto';

export class BaseResponseWithActionDates extends BaseResponse {
  @ApiProperty({ type: Date })
  public createdAt: Date;
  @ApiProperty({ type: Date })
  public updatedAt: Date;
  @ApiPropertyOptional({ type: Date, default: null })
  public deletedAt?: Date;
  @ApiPropertyOptional({ type: Boolean, default: null })
  public isActive?: boolean;

  constructor(init: Partial<BaseResponseWithActionDates>) {
    super(init);

    this.createdAt = init.createdAt;
    this.updatedAt = init.updatedAt;
    this.deletedAt = init.deletedAt;
    this.isActive = init.isActive;
  }
}
