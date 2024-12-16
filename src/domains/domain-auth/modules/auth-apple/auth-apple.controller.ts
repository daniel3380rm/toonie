import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthAppleService } from './auth-apple.service';
import { AuthAppleLoginDto } from './dto/auth-apple-login.dto';
import { GetIpAddress } from 'src/common/decorators/ip-address.decorator';
import { GetUserAgents } from 'src/common/decorators/user-agent.decorator';
import { SuccessResponse } from 'src/common/dto/response/success.response';
import { Public } from '../../authentications/decorators/public.decorator';
import { AuthService } from '../../authentications/services/authentication.service';

@ApiTags('Auth')
@Controller({
  path: 'auth/apple',
  version: '1',
})
export class AuthAppleController {
  constructor(
    public authService: AuthService,
    public authAppleService: AuthAppleService,
  ) {}

  @ApiResponse({
    status: HttpStatus.OK,
    type: SuccessResponse,
  })
  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: AuthAppleLoginDto,
    @GetUserAgents() userAgents: string,
    @GetIpAddress() ip: string,
  ) {
    const socialData = await this.authAppleService.getProfileByToken(loginDto);

    return new SuccessResponse({
      data: await this.authService.validateSocialLogin(
        'apple',
        socialData,
        userAgents,
        ip,
      ),
    });
  }
}
