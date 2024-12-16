import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UsersService } from './services/users.service';
import { UserAdminController } from './controllers/user-admin.controller';
import { RoleModule } from '../authorization/roles/role.module';
import { PermissionModule } from '../authorization/permission/permission.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    RoleModule,
    PermissionModule,
  ],
  providers: [UsersService],
  controllers: [UserAdminController],
  exports: [UsersService],
})
export class UsersModule {}
