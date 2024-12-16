import { BaseResponseWithActionDates } from 'src/common/dto/response/base-response-with-action-dates.dto';
import { ApiResponseProperty } from '@nestjs/swagger';

export class FinancialFormScoreResponseDto extends BaseResponseWithActionDates {
  @ApiResponseProperty()
  financialId: number;

  @ApiResponseProperty()
  userId: number;

  constructor(init?: Partial<FinancialFormScoreResponseDto>) {
    super(init);
    this.financialId = init?.financialId;
    this.userId = init?.userId;
  }
}
