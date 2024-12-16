import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString } from 'src/common/decorators/validation/default';
import { IsNotEmpty } from '../../../../common/decorators/validation/default';

export class RefreshTokenDto {
  @ApiProperty()
  @IsString()
  @Expose({ name: 'refresh-token' })
  @IsNotEmpty()
  'Refresh-Token': string;
}
