import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserDevicesService } from './user-devices.service';
import { CreateUserDeviceDto } from './dto/create-user-device.dto';
import { GetUser, IUser } from 'src/common/decorators';
import { PermissionGuard } from 'src/domains/domain-auth/authorization/permission/permission.guard';
import { GetIpAddress } from 'src/common/decorators/ip-address.decorator';

@ApiBearerAuth()
@UseGuards(PermissionGuard)
@ApiTags('User Device')
@Controller({
  path: 'user/devices',
  version: '1',
})
export class UserWeightsController {
  constructor(private readonly userDevicesService: UserDevicesService) {}

  @Patch()
  @HttpCode(HttpStatus.OK)
  update(
    @Body() createUserDeviceDto: CreateUserDeviceDto,
    @GetUser() user: IUser,
    @GetIpAddress() ipAddress,
  ) {
    return this.userDevicesService.update(
      { ...createUserDeviceDto, ipAddress: ipAddress },
      user.id,
    );
  }
}
