import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Controller, Post, Body, HttpStatus, Get } from '@nestjs/common';
import { FinancialFormTimeService } from '../services/financial-form-time.service';
import { CreateFinancialFormTimeDto } from '../dto/create-financial-form-time.dto';
import { SuccessResponse } from 'src/common/dto/response/success.response';
import { GetUser, IUser } from 'src/common/decorators';
import { Public } from '../../../domain-auth/authentications/decorators/public.decorator';
import { FinancialFormTimeResponseDto } from '../dto/financial-form-response.dto';
import { ApiPaginationQuery, Paginate, PaginateQuery } from 'nestjs-paginate';
import { FinancialFormTimePaginationConfigConst } from '../constant/financial-form-time-pagination-config.const';

@ApiBearerAuth()
@ApiTags('Financial Form Time')
@Controller({
  path: 'financial-form-time',
  version: '1',
})
export class FinancialFormTimeController {
  constructor(
    private readonly financialFormService: FinancialFormTimeService,
  ) {}

  @ApiOperation({ summary: 'Fill financial form time' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: Boolean,
  })
  @Public()
  @Post()
  async createTime(
    @GetUser() user: IUser,
    @Body() createDto: CreateFinancialFormTimeDto,
  ) {
    const financialFormIns = await this.financialFormService.create({
      userId: user?.id,
      ...createDto,
    });
    return new SuccessResponse({ data: financialFormIns });
  }

  @ApiOperation({ summary: 'get all financial form time for user ' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: FinancialFormTimeResponseDto,
  })
  @ApiPaginationQuery(FinancialFormTimePaginationConfigConst)
  @Get()
  async findAllWithUserId(
    @Paginate() query: PaginateQuery,
    @GetUser() user: IUser,
  ) {
    const response = await this.financialFormService.findAllWithUserId(
      user?.id,
      query,
    );
    return new SuccessResponse({
      data:
        response?.data?.map((item) => new FinancialFormTimeResponseDto(item)) ??
        [],
      metadata: {
        meta: response?.meta ?? null,
        links: response?.links ?? null,
      },
    });
  }
}
