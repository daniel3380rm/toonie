import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  Controller,
  HttpStatus,
  Get,
  UseGuards,
  Param,
  Put,
  Patch,
  Body,
  Delete,
} from '@nestjs/common';
import { FinancialFormService } from '../services/financial-form.service';
import { FinancialFormResponseDto } from '../dto/financial-form-response.dto';
import { SuccessResponse } from 'src/common/dto/response/success.response';
import { ApiPaginationQuery, Paginate, PaginateQuery } from 'nestjs-paginate';
import { PermissionGuard } from '../../../domain-auth/authorization/permission/permission.guard';
import { FinancialFormPaginationConfigConst } from '../constant/financial-form-pagination-config.const';
import { FinancialFormAdminResponseDto } from '../dto/financial-form-admin-response.dto';
import { IdDto } from '../../../../common/dto/request/id.dto';
import { UpdateFinancialFormDto } from '../dto/update-financial-form.dto';
import { GetUser, IUser } from '../../../../common/decorators';

@ApiBearerAuth()
@UseGuards(PermissionGuard)
@ApiTags('Admin Financial Form')
@Controller({
  path: 'admin/financial-form',
  version: '1',
})
export class FinancialFormAdminController {
  constructor(private readonly financialFormService: FinancialFormService) {}

  @ApiOperation({ summary: 'get all financial form' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: FinancialFormResponseDto,
  })
  @ApiPaginationQuery(FinancialFormPaginationConfigConst)
  @Get()
  async findAll(@Paginate() query: PaginateQuery) {
    const response = await this.financialFormService.findAll(query);

    return new SuccessResponse({
      data:
        response?.data?.map(
          (item) => new FinancialFormAdminResponseDto(item),
        ) ?? [],
      metadata: {
        meta: response?.meta ?? null,
        links: response?.links ?? null,
      },
    });
  }

  // TODO :   pro mise
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

  @ApiOperation({ summary: 'get financial form' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: FinancialFormResponseDto,
  })
  @Get(':id')
  async findOne(@Param() { id }: IdDto) {
    const response = await this.financialFormService.findOne({
      id,
    });

    return new SuccessResponse({
      data: new FinancialFormResponseDto(response) ?? null,
    });
  }

  @ApiOperation({ summary: 'add advise or remove' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: FinancialFormResponseDto,
  })
  @Patch('advise/:id')
  async updateAdvise(
    @Param() { id }: IdDto,
    @Body() updateDto: UpdateFinancialFormDto,
  ) {
    await this.financialFormService.update(id, updateDto);
    return new SuccessResponse({
      data: null,
    });
  }

  @ApiOperation({ summary: 'update financial form' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: FinancialFormResponseDto,
  })
  @Patch(':id')
  async update(
    @Param() { id }: IdDto,
    @Body() updateDto: UpdateFinancialFormDto,
  ) {
    await this.financialFormService.update(id, updateDto);
    return new SuccessResponse({
      data: null,
    });
  }

  @ApiOperation({ summary: 'delete financial form' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: FinancialFormResponseDto,
  })
  @Delete(':id')
  async softDelete(@Param() { id }: IdDto) {
    await this.financialFormService.softDeleteById(id);
    return new SuccessResponse({
      data: null,
    });
  }
}
