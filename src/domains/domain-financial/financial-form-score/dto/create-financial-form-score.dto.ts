import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, MaxLength, MinLength } from 'class-validator';

export class CreateFinancialFormScoreDto {
  @ApiProperty({
    description: 'financialId for Score',
    example: '1',
    required: true,
  })
  @IsOptional()
  financialId: number;

  @ApiProperty({
    description: 'Score range for making turns',
    example: '1',
    required: true,
  })
  @MaxLength(5)
  @MinLength(1)
  @IsOptional()
  score: number;

  userId: number;
}
