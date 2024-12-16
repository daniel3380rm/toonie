import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGoogleService } from './auth-google.service';
import { AuthGoogleLoginDto } from './dto/auth-google-login.dto';
import { AuthService } from '../../authentications/services/authentication.service';
import { SuccessResponse } from '../../../../common/dto/response/success.response';
import { Public } from '../../authentications/decorators/public.decorator';
import { GetUserAgents } from '../../../../common/decorators/user-agent.decorator';
import { GetIpAddress } from '../../../../common/decorators/ip-address.decorator';

@ApiTags('Auth')
@Controller({
  path: 'auth/google',
  version: '1',
})
export class AuthGoogleController {
  constructor(
    public authService: AuthService,
    public authGoogleService: AuthGoogleService,
  ) {}

  @ApiResponse({
    status: HttpStatus.OK,
    type: SuccessResponse,
  })
  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: AuthGoogleLoginDto,
    @GetUserAgents() userAgents: string,
    @GetIpAddress() ip: string,
  ) {
    const socialData = await this.authGoogleService.getProfileByToken(loginDto);

    return new SuccessResponse({
      data: await this.authService.validateSocialLogin(
        'google',
        socialData,
        userAgents,
        ip,
      ),
    });
  }
}
