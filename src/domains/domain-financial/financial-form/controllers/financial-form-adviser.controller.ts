import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  Controller,
  Post,
  Body,
  HttpStatus,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';
import { FinancialFormService } from '../services/financial-form.service';
import { FinancialFormResponseDto } from '../dto/financial-form-response.dto';
import { CreateFinancialFormDto } from '../dto/create-financial-form.dto';
import { SuccessResponse } from 'src/common/dto/response/success.response';
import { GetUser, IUser } from 'src/common/decorators';
import { Public } from '../../../domain-auth/authentications/decorators/public.decorator';
import { ApiPaginationQuery, Paginate, PaginateQuery } from 'nestjs-paginate';
import { FinancialFormPaginationConfigConst } from '../constant/financial-form-pagination-config.const';
import { IdDto } from '../../../../common/dto/request/id.dto';
import { RoleGuard } from 'src/domains/domain-auth/authorization/roles/role.guard';
import { RoleType } from 'src/domains/domain-auth/authorization/roles/role.decorator';

@ApiBearerAuth()
@ApiTags('Financial Form Advise')
@Controller({
  path: 'financial-form-advise',
  version: '1',
})
export class FinancialFormAdviserController {
  constructor(private readonly financialFormService: FinancialFormService) {}

  @ApiOperation({ summary: 'get all financial form for user' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: FinancialFormResponseDto,
  })
  @ApiPaginationQuery(FinancialFormPaginationConfigConst)
  @Get()
  // @UseGuards(RoleGuard)
  // @RoleType(4)
  async findAllWithUserId(
    @Paginate() query: PaginateQuery,
    @GetUser() user: IUser,
  ) {
    const response = await this.financialFormService.findAllWithAdviserId(
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