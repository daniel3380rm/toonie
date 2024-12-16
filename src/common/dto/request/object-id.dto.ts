import { ApiProperty } from '@nestjs/swagger';
import { IsObjectId } from 'src/common/decorators/validation';

export class ObjectIdDto {
  @ApiProperty({ default: '63d8bb780539ac9e6df67b40' })
  @IsObjectId({ optional: false })
  id: string;
}
