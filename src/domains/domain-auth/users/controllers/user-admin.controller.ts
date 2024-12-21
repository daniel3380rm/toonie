import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserResponseDto } from '../dto/user-response.dto';
import { UserPermissions } from '../enums/user-permissions.enum';
import { PermissionGuard } from '../../authorization/permission/permission.guard';
import { PermissionType } from '../../authorization/permission/permission.decorator';
import { UsersService } from '../services/users.service';
import { SuccessResponse } from '../../../../common/dto/response/success.response';
import { ApiPaginationQuery, Paginate, PaginateQuery } from 'nestjs-paginate';
import { IdDto } from '../../../../common/dto/request/id.dto';
import { UserPaginationConfigConst } from '../constant/user-pagination-config.const';
import { UpdateUserDto } from '../dto/update-user.dto';

@ApiTags('Admin Users')
@ApiBearerAuth()
@UseGuards(PermissionGuard)
@Controller({
  path: 'admin/users',
  version: '1',
})
export class UserAdminController {
  constructor(private readonly usersService: UsersService) {}

  @PermissionType(UserPermissions.CREATE_USER)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(@Body() createUsersDto: CreateUserDto) {
    const userFound = await this.usersService.create({
      ...createUsersDto,
    });
    return new SuccessResponse({ data: new UserResponseDto(userFound) });
  }

  // @PermissionType(UserPermissions.READ_USER)
  @ApiPaginationQuery(UserPaginationConfigConst)
  @ApiOperation({
    summary: ' list users',
  })
  @Get()
  async findAll(@Paginate() query: PaginateQuery) {
    const response = await this.usersService.findAll(query);
    return new SuccessResponse({
      data: response?.data?.map((item) => new UserResponseDto(item)) ?? [],
      metadata: {
        meta: response?.meta ?? null,
        links: response?.links ?? null,
      },
    });
  }

  @PermissionType(UserPermissions.READ_USER)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param() { id }: IdDto) {
    const userFound = await this.usersService.findOne({ id });
    return new SuccessResponse({ data: new UserResponseDto(userFound) });
  }

  @PermissionType(UserPermissions.UPDATE_USER)
  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  async update(@Param() { id }: IdDto, @Body() updateUsersDto: UpdateUserDto) {
    await this.usersService.update(id, updateUsersDto);
    return new SuccessResponse({ data: {} });
  }

  @PermissionType(UserPermissions.DELETE_USER)
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async softDelete(@Param() { id }: IdDto) {
    await this.usersService.softDeleteById(id);
    return new SuccessResponse({ data: {} });
  }
}
