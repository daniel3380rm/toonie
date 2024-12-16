import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'src/common/decorators/validation/default';

export class UUIDDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}
