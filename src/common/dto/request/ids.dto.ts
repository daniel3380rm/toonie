import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsId } from 'src/common/decorators/validation';

export class IdsDto {
  @ApiProperty({ default: [1], isArray: true })
  @Transform((o) => {
    const ids = o.value.split(',');
    return ids.map((value: string) => Number(value));
  })
  @IsId({ optional: false, each: true })
  ids: number[];
}
