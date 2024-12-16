import { ApiProperty } from '@nestjs/swagger';
import { UserSessionResponseDto } from '../../modules/user-sessions/dto/user-sessions-response.dto';
import { UserResponseDto } from '../../users/dto/user-response.dto';

export class AuthenticationDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty({ type: UserResponseDto })
  user: UserResponseDto;

  @ApiProperty({ type: UserSessionResponseDto })
  session: UserSessionResponseDto;

  constructor(init: Partial<AuthenticationDto>) {
    this.accessToken = init.accessToken;
    this.refreshToken = init.refreshToken;
    this.user = init.user ? new UserResponseDto(init.user) : undefined;
    this.session = init.session
      ? new UserSessionResponseDto(init.session)
      : undefined;
  }
}
