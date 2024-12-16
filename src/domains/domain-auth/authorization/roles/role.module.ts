import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleController } from './controllers/roles-admin.controller';
import { RoleService } from './role.service';
import { CachingModule } from 'src/common/caching/caching.module';
import { UsersModule } from '../../users/users.module';
import { Roles } from './entities/role.entity';
import { PermissionModule } from '../permission/permission.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Roles]),
    CachingModule,
    forwardRef(() => UsersModule),
    forwardRef(() => PermissionModule),
  ],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService, TypeOrmModule],
})
export class RoleModule {}
