import { ApiProperty } from '@nestjs/swagger';
import { ParentDto } from 'src/common/dto/base.dto';
import { UserDeviceInstallationSourcesEnum } from '../enums/user-device-installation-source.enum';
import { UserDeviceOperationSystemsEnum } from '../enums/user-device-operation-systems.enum';
import { IsNotEmpty, IsString } from 'src/common/decorators/validation/default';
import { IsEnum } from 'src/common/decorators/validation/default/is-enum.decorator';
import { IsEmpty } from 'class-validator';

export class CreateUserDeviceDto extends ParentDto {
  @ApiProperty({ example: 'iOS' })
  @IsString()
  @IsEnum(UserDeviceOperationSystemsEnum)
  @IsNotEmpty()
  operationSystem: UserDeviceOperationSystemsEnum;

  @ApiProperty({ example: '12.0' })
  @IsString()
  @IsNotEmpty()
  systemVersion: string;

  @ApiProperty({ example: '82' })
  @IsString()
  @IsNotEmpty()
  buildNumber: string;

  @ApiProperty({ example: 'Apple' })
  @IsString()
  @IsNotEmpty()
  brand: string;

  @IsEmpty()
  ipAddress: string;

  @ApiProperty({ example: 'APPLESTORE' })
  @IsString()
  @IsEnum(UserDeviceInstallationSourcesEnum)
  @IsNotEmpty()
  installationSource: UserDeviceInstallationSourcesEnum;

  @ApiProperty({ example: '1.0.0' })
  @IsString()
  @IsNotEmpty()
  appVersion: string;
}
