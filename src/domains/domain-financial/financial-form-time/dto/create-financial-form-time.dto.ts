import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class CreateFinancialFormTimeDto {
  // @ApiProperty({
  //   description: 'Time range for making turns',
  //   example: '20',
  //   required: false,
  // })
  // @IsOptional()
  // range: number;

  @ApiProperty({
    description: 'Date of creation of turns',
    example: '2024/11/13',
    required: false,
  })
  @IsOptional()
  day: Date;

  @ApiProperty({
    description: 'start time turn',
    example: '10:00',
    required: true,
  })
  @IsOptional()
  startTime: string;

  @ApiProperty({
    description: 'end time turn',
    example: '20:00',
    required: true,
  })
  @IsOptional()
  endTime: string;

  userId: number;
}
