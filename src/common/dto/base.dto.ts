import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class ParentDto {
  @ApiProperty({ example: false })
  @IsOptional()
  isActive?: boolean;
}
