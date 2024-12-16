import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Permission } from './entities/permission.entity';
import { PermissionErrors } from './enums/permission-messages.enum';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}

  findByAccess(access: string) {
    return this.permissionRepository.findOne({
      where: { access },
      select: ['id'],
    });
  }

  async findByIds(ids: number[]) {
    const permissionsFound = await this.permissionRepository.find({
      where: { id: In(ids) },
    });
    if (permissionsFound.length != ids.length) {
      throw new NotFoundException(PermissionErrors.LIST_NOT_FOUND);
    }
    return permissionsFound;
  }
}
