import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Roles } from './entities/role.entity';
import { Permission } from '../permission/entities/permission.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleErrors } from './enums/role-messages.enum';
import { PermissionService } from '../permission/permission.service';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Roles)
    private readonly roleRepository: Repository<Roles>,
    private readonly permissionService: PermissionService,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<Roles> {
    await this.isDuplicated(createRoleDto.name);

    let permissionsFound = [];
    if (createRoleDto.permissionIds.length) {
      permissionsFound = await this.permissionService.findByIds(
        createRoleDto.permissionIds,
      );
    }

    return this.roleRepository.save(
      this.roleRepository.create({
        ...createRoleDto,
        permissions: permissionsFound,
      }),
    );
  }

  async isDuplicated(name: string, id?: number) {
    const roleFound = await this.roleRepository.findOne({
      where: { name },
      select: ['id'],
    });
    if (roleFound) {
      if (id && id === roleFound.id) return true;
      throw new ConflictException(RoleErrors.NAME_DUPLICATED);
    }
  }

  async findByIds(ids: number[]) {
    const rolesFound = await this.roleRepository.find({
      where: { id: In(ids) },
    });
    if (rolesFound.length !== ids.length)
      throw new NotFoundException(RoleErrors.LIST_OF_ROLES_NOT_FOUND);
    return rolesFound;
  }

  async findAll(): Promise<Roles[]> {
    return await this.roleRepository.find();
  }

  async findOne(id: number) {
    const roleFound = await this.roleRepository
      .createQueryBuilder('role')
      .select()
      .where('role.id = :id', { id })
      .leftJoinAndSelect('role.permissions', 'permissions')
      .loadRelationCountAndMap('role.usersCount', 'role.users', 'usersCount')
      .getOne();
    if (!roleFound) throw new NotFoundException(RoleErrors.NOT_FOUND);
    return roleFound;
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    const roleFound = await this.findOne(id);

    if (updateRoleDto.name) {
      await this.isDuplicated(updateRoleDto.name, id);
    }

    let permissions: Permission[] | undefined;
    if (updateRoleDto.permissionIds) {
      permissions = await this.permissionService.findByIds(
        updateRoleDto.permissionIds,
      );
    }
    const result = Object.assign(roleFound, updateRoleDto);
    result.permissions = permissions;
    await result.save();
  }

  async remove(id: number) {
    const roleFound = await this.findOne(id);
    await roleFound.softDelete();
  }

  async removeByIds({ ids }: { ids: number[] }) {
    const rolesFound = await this.roleRepository.find({
      where: { id: In(ids) },
    });
    if (rolesFound.length !== ids.length)
      throw new NotFoundException(RoleErrors.LIST_OF_ROLES_NOT_FOUND);
    for await (const role of rolesFound) {
      await role.softDelete();
    }
  }

  async getPermissionsByUserId(id: number) {
    const rolesFound = await this.roleRepository.find({
      relations: ['permissions', 'users'],
      where: {
        users: {
          id,
        },
      },
    });

    const permissions = [];
    for (const role of rolesFound) {
      permissions.push(...role.permissions);
    }
    return permissions;
  }

  async findByKey(key: string): Promise<Roles> {
    const roleFound = await this.roleRepository.findOne({ where: { key } });
    if (!roleFound) throw new NotFoundException(RoleErrors.NOT_FOUND);
    return roleFound;
  }

  async findByKeys(keys: string[]): Promise<Roles[]> {
    const rolesFound = await this.roleRepository.find({
      where: { key: In(keys) },
    });
    return rolesFound;
  }
}
