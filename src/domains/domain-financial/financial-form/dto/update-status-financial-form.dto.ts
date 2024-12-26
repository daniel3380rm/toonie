import { ApiProperty } from '@nestjs/swagger';

export class UpdateStatusFinancialFormDto {
  @ApiProperty({
    description: 'status',
    example: '3',
  })
  status: number;

  userId: number;
}
