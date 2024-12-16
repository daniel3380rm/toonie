import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsObjectId } from 'src/common/decorators/validation';

export class ObjectIdsDto {
  @ApiProperty({ default: ['63d8bb64d87789f837d2454e'] })
  @Transform((o) => {
    return o.value.split(',');
  })
  @IsObjectId({ each: true, optional: false })
  ids: string[];
}
