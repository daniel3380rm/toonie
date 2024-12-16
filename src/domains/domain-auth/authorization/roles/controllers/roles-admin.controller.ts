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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RoleService } from '../role.service';
import { CreateRoleDto } from '../dto/create-role.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { RoleDto } from '../dto/role.dto';
import { IdDto } from 'src/common/dto/request/id.dto';
import { PermissionType } from '../../permission/permission.decorator';
import { RolePermissions } from '../enums/role-permissions.enum';
import { GetReqId } from 'src/common/decorators/get-req-id.decorator';
import { IdsDto } from 'src/common/dto/request/ids.dto';
import { PermissionGuard } from '../../permission/permission.guard';
import { SuccessResponse } from 'src/common/dto/response/success.response';

@ApiBearerAuth()
@ApiTags('Admin Roles')
@UseGuards(PermissionGuard)
@Controller({
  path: 'admin/roles',
  version: '1',
})
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @PermissionType(RolePermissions.CREATE_ROLE)
  @Post()
  async create(@Body() createUserRoleDto: CreateRoleDto) {
    const roleInstance = await this.roleService.create({
      ...createUserRoleDto,
    });
    return new RoleDto(roleInstance);
  }

  @Get()
  @PermissionType(RolePermissions.READ_ROLE)
  @HttpCode(HttpStatus.OK)
  async findAll() {
    const rolesFound = await this.roleService.findAll();
    return new SuccessResponse({
      data: rolesFound.map((role) => new RoleDto(role)),
    });
  }

  @Get(':id')
  @PermissionType(RolePermissions.READ_ROLE)
  async findOne(@Param() { id }: IdDto) {
    const roleFound = await this.roleService.findOne(id);
    return new SuccessResponse({ data: new RoleDto(roleFound) });
  }

  @PermissionType(RolePermissions.UPDATE_ROLE)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param() { id }: IdDto,
    @GetReqId() requestId: number,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    await this.roleService.update(id, {
      ...updateRoleDto,
      metadata: { requestId },
    });
    return new SuccessResponse({ data: {} });
  }

  @PermissionType(RolePermissions.DELETE_ROLE)
  @Delete(':ids')
  async remove(@Param() { ids }: IdsDto) {
    await this.roleService.removeByIds({ ids });
    return new SuccessResponse({ data: {} });
  }
}
