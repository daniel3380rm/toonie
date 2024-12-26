import { ApiProperty } from '@nestjs/swagger';

export class UpdateStatusFinancialFormDto {
  @ApiProperty({
    description: 'status',
    example: '3',
    required: false,
  })
  status: number;

  userId: number;
}
