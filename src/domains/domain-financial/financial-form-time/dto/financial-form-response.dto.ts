import { BaseResponseWithActionDates } from 'src/common/dto/response/base-response-with-action-dates.dto';
import { ApiResponseProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { ItemStatusFinancialFormTime } from '../enums/item-status-financial-form-time.enum';

export class FinancialFormTimeResponseDto extends BaseResponseWithActionDates {
  @ApiResponseProperty()
  time: Date;

  @ApiResponseProperty()
  status: number;

  @ApiResponseProperty()
  @Transform(({ obj }) => ItemStatusFinancialFormTime[obj.status as number])
  itemStatus: string;

  @ApiResponseProperty()
  userId: number;

  constructor(init?: Partial<FinancialFormTimeResponseDto>) {
    super(init);
    this.time = init?.time;
    this.status = init?.status;
    this.itemStatus = ItemStatusFinancialFormTime[init?.status];
    this.userId = init?.userId;
    this.userId = init?.userId;
  }
}
