import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../../domains/domain-auth/users/entities/user.entity';
import { UserSeedService } from './user-seed.service';
import { Permission } from '../../../domains/domain-auth/authorization/permission/entities/permission.entity';
import { Roles } from 'src/domains/domain-auth/authorization/roles/entities/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, Roles, Permission])],
  providers: [UserSeedService],
  exports: [UserSeedService],
})
export class UserSeedModule {}
