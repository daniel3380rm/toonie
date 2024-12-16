import { ApiResponseProperty } from '@nestjs/swagger';
import { FinancialFormResponseDto } from './financial-form-response.dto';
import { UserResponseDto } from '../../../domain-auth/users/dto/user-response.dto';

export class FinancialFormAdminResponseDto extends FinancialFormResponseDto {
  @ApiResponseProperty({ type: UserResponseDto })
  user: UserResponseDto;

  constructor(init?: Partial<FinancialFormAdminResponseDto>) {
    super(init);
    this.user = init.user ? new UserResponseDto(init.user) : null;
  }
}
