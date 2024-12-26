import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateStatusFinancialFormDto {
  @ApiProperty({
    description: 'status',
    example: '3',
  })
  @IsOptional()
  status: number;

  userId: number;
}
