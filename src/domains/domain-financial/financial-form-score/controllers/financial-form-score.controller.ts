import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Controller, Post, Body, HttpStatus, Get } from '@nestjs/common';
import { FinancialFormScoreService } from '../services/financial-form-score.service';
import { CreateFinancialFormScoreDto } from '../dto/create-financial-form-score.dto';
import { SuccessResponse } from 'src/common/dto/response/success.response';
import { GetUser, IUser } from 'src/common/decorators';
import { Public } from '../../../domain-auth/authentications/decorators/public.decorator';

@ApiBearerAuth()
@ApiTags('Financial Form Score')
@Controller({
  path: 'financial-form-score',
  version: '1',
})
export class FinancialFormScoreController {
  constructor(
    private readonly financialFormService: FinancialFormScoreService,
  ) {}

  @ApiOperation({ summary: 'Add Score For Financial' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: Boolean,
  })
  @Public()
  @Post()
  async createScore(
    @GetUser() user: IUser,
    @Body() createDto: CreateFinancialFormScoreDto,
  ) {
    const financialFormIns = await this.financialFormService.create({
      userId: user?.id,
      ...createDto,
    });
    return new SuccessResponse({ data: financialFormIns });
  }
}
