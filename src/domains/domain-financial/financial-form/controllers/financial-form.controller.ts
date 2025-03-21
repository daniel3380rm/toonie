import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Controller, Post, Body, HttpStatus, Get, Param } from '@nestjs/common';
import { FinancialFormService } from '../services/financial-form.service';
import { FinancialFormResponseDto } from '../dto/financial-form-response.dto';
import { CreateFinancialFormDto } from '../dto/create-financial-form.dto';
import { SuccessResponse } from 'src/common/dto/response/success.response';
import { GetUser, IUser } from 'src/common/decorators';
import { Public } from '../../../domain-auth/authentications/decorators/public.decorator';
import { ApiPaginationQuery, Paginate, PaginateQuery } from 'nestjs-paginate';
import { FinancialFormPaginationConfigConst } from '../constant/financial-form-pagination-config.const';
import { IdDto } from '../../../../common/dto/request/id.dto';

@ApiBearerAuth()
@ApiTags('Financial Form')
@Controller({
  path: 'financial-form',
  version: '1',
})
export class FinancialFormController {
  constructor(private readonly financialFormService: FinancialFormService) {}

  @ApiOperation({ summary: 'Fill financial form' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: FinancialFormResponseDto,
  })
  @Public()
  @Post()
  async create(
    @GetUser() user: IUser,
    @Body() createDto: CreateFinancialFormDto,
  ) {
    const financialFormIns = await this.financialFormService.create({
      userId: user?.id,
      ...createDto,
    });
    return new SuccessResponse({ data: financialFormIns });
  }

  @ApiOperation({ summary: 'get all financial form for user' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: FinancialFormResponseDto,
  })
  @ApiPaginationQuery(FinancialFormPaginationConfigConst)
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
        response?.data?.map((item) => new FinancialFormResponseDto(item)) ?? [],
      metadata: {
        meta: response?.meta ?? null,
        links: response?.links ?? null,
      },
    });
  }

  @ApiOperation({ summary: 'get all adviser form for user' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: FinancialFormResponseDto,
  })
  @ApiPaginationQuery(FinancialFormPaginationConfigConst)
  @Get('advisor')
  async findAllAdvisorWithUserId(@Paginate() query: PaginateQuery) {
    const response = await this.financialFormService.findAllAdvisorWithUserId(
      query,
    );
    return new SuccessResponse({
      data:
        response?.data?.map((item) => new FinancialFormResponseDto(item)) ?? [],
      metadata: {
        meta: response?.meta ?? null,
        links: response?.links ?? null,
      },
    });
  }

  @ApiOperation({ summary: 'get financial form for user' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: FinancialFormResponseDto,
  })
  @Get(':id')
  async findOne(
    @Param() { id }: IdDto,
    @GetUser()
    user: IUser,
  ) {
    const response = await this.financialFormService.findOne({
      id,
      userId: user?.id,
    });

    return new SuccessResponse({
      data: new FinancialFormResponseDto(response) ?? null,
    });
  }
}
