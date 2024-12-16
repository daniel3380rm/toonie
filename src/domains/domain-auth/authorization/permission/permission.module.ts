import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from '../permission/entities/permission.entity';
import { PermissionService } from '../permission/permission.service';
import { CachingModule } from 'src/common/caching/caching.module';
import { RoleModule } from '../roles/role.module';
import { UsersModule } from '../../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Permission]),
    CachingModule,
    forwardRef(() => UsersModule),
    forwardRef(() => RoleModule),
  ],
  controllers: [],
  providers: [PermissionService],
  exports: [PermissionService, TypeOrmModule],
})
export class PermissionModule {}
