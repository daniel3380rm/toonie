import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserDevice } from './entities/user-device.entity';
import { UserDevicesService } from './user-devices.service';
import { RoleModule } from 'src/domains/domain-auth/authorization/roles/role.module';
import { PermissionModule } from 'src/domains/domain-auth/authorization/permission/permission.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserDevice]),
    RoleModule,
    PermissionModule,
  ],
  // controllers: [UserWeightsController],
  providers: [UserDevicesService],
  exports: [UserDevicesService],
})
export class UserDevicesModule {}
