import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetIpAddress } from 'src/common/decorators/ip-address.decorator';
import { Public } from '../decorators/public.decorator';
import { OtpSendCodeDto } from '../dto/otp-send-code.dto';
import { OtpVerifyDto } from '../dto/otp-verify.dto';
import { ForgetPasswordDto } from '../dto/forget-password.dto';
import { VerifyForgetPasswordDto } from '../dto/verify-forget-password.dto';
import { ChangeForgetPasswordDto } from '../dto/change-forget-password.dto';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { GetUser } from 'src/common/decorators';
import { RequestHeader } from 'src/common/decorators/request-header.decorator';
import { ForgetPasswordService } from '../services/forget-password.service';
import { AuthOtpService } from '../services/auth-otp.service';
import { AuthHelperService } from '../services/auth-helper.service';
import { TwoFAVerifyDto } from '../dto/2fa-verify.dto';
import { ConfigService } from '@nestjs/config';
import { routePath } from 'src/common/helper';
import { ForgetPasswordTemporaryGuard } from '../guards/forget-password-temporary.guard';
import { AuthTwoFAService } from '../services/auth-2fa.service';
import { TwoFATemporaryGuard } from '../guards/two-factor-authentication-temporary.guard';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { ChangeCredentialSendCodeDto } from '../dto/change-credential-send-code.dto';
import { ChangeCredentialVerifyDto } from '../dto/change-credential-verify.dto';
import { TwoFASetDto } from '../dto/2fa-set.dto';
import { RefreshTokenGuard } from '../guards/refresh-token.guard';
import { UserEntity } from '../../users/entities/user.entity';
import { TwoFARegisterDto } from '../dto/2fa-register.dto';
import { TwoFARevokeDto } from '../dto/2fa-revoke.dto';
import { AuthService } from '../services/authentication.service';
import { UsersService } from '../../users/services/users.service';
import { SuccessResponse } from '../../../../common/dto/response/success.response';
import { AuthLoginDto } from '../dto/authentication-login.dto';
import { GetUserAgents } from '../../../../common/decorators/user-agent.decorator';
import { AuthenticationLoginStep } from '../enums/authentication-login-step.enum';

@ApiTags('Auth')
@Controller({
  path: 'auth',
  version: '1',
})
export class UsersAuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private authOtpService: AuthOtpService,
    private forgetPasswordService: ForgetPasswordService,
    private authTwoFAService: AuthTwoFAService,
    private authHelperService: AuthHelperService,
    private readonly configService: ConfigService,
  ) {}

  @ApiResponse({
    status: HttpStatus.OK,
    type: SuccessResponse,
  })
  @Public()
  @Post('login')
  async login(
    @Body() authLoginDto: AuthLoginDto,
    @GetUserAgents() userAgents: string,
    @GetIpAddress() ip: string,
  ) {
    const { status, data } = await this.authService.loginWithPassword(
      authLoginDto,
      userAgents,
      ip,
    );

    const controllerMethod =
      status === AuthenticationLoginStep.OTP_PHONE_NUMBER ||
      status === AuthenticationLoginStep.OTP_EMAIL
        ? UsersAuthController.prototype.verifyCode
        : status === AuthenticationLoginStep.TWO_F_A
        ? UsersAuthController.prototype.verifyTwoFA
        : null;

    const nextPath =
      controllerMethod &&
      routePath(this.configService, UsersAuthController, controllerMethod);

    return new SuccessResponse({
      data,
      metadata: {
        nextStep: status !== AuthenticationLoginStep.LOGIN ? status : null,
        nextPath,
      },
    });
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: SuccessResponse,
  })
  @Public()
  @UseGuards(RefreshTokenGuard)
  @ApiHeader({ name: 'refresh-token' })
  @Get('refresh')
  async refreshTokens(
    @RequestHeader(RefreshTokenDto) header: RefreshTokenDto,
    @GetUserAgents() userAgents: string,
    @GetIpAddress() ip: string,
  ) {
    return new SuccessResponse({
      data: await this.authService.refreshToken(
        header['Refresh-Token'],
        userAgents,
        ip,
      ),
    });
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: SuccessResponse,
  })
  @Public()
  @Post('otp/register')
  async sendCode(@Body() otpSendCode: OtpSendCodeDto) {
    return new SuccessResponse({
      data: await this.authOtpService.registerWithOtp(otpSendCode),
    });
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: SuccessResponse,
  })
  @Public()
  @Post('otp/verify')
  async verifyCode(
    @Body() otpVerifyDto: OtpVerifyDto,
    @GetUserAgents() userAgents: string,
    @GetIpAddress() ip: string,
  ) {
    console.log('phoneNumber');

    return new SuccessResponse({
      data: await this.authOtpService.loginWithOtp(
        otpVerifyDto,
        userAgents,
        ip,
      ),
    });
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: SuccessResponse,
  })
  @ApiBearerAuth()
  @Post('2fa/register')
  async registerTwoFA(
    @GetUser() user,
    @Body() { twoFAType }: TwoFARegisterDto,
  ) {
    return new SuccessResponse({
      data: await this.authTwoFAService.register2FA(user, twoFAType),
    });
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: SuccessResponse,
  })
  @ApiBearerAuth()
  @Post('2fa/set')
  async setTwoFA(@GetUser() user, @Body() { twoFAType, code }: TwoFASetDto) {
    return new SuccessResponse({
      data: await this.authTwoFAService.set2FA(user, twoFAType, code),
    });
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: SuccessResponse,
  })
  @ApiBearerAuth()
  @Post('2fa/revoke')
  async revokeTwoFA(@GetUser() user) {
    return new SuccessResponse({
      data: await this.authTwoFAService.revoke2FA(user),
    });
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: SuccessResponse,
  })
  @ApiBearerAuth()
  @Post('2fa/revoke/submit')
  async submitRevokeTwoFA(@GetUser() user, @Body() { code }: TwoFARevokeDto) {
    return new SuccessResponse({
      data: await this.authTwoFAService.submitRevoke2FA(user, code),
    });
  }

  @Public()
  @ApiResponse({
    status: HttpStatus.OK,
    type: SuccessResponse,
  })
  @ApiHeader({ name: 'temporary-token' })
  @UseGuards(TwoFATemporaryGuard)
  @Post('2fa/verify')
  async verifyTwoFA(
    @Req() { tempKey: userId },
    @Body() { code }: TwoFAVerifyDto,
    @GetUserAgents() userAgents: string,
    @GetIpAddress() ip: string,
  ) {
    const userFound = await this.usersService.findByIdAndActive(userId, true);

    await this.authTwoFAService.verify2FA(userFound, userFound.twoFAType, code);

    await this.authHelperService.removeTwoFATemporaryToken(userId);

    const data = await this.authTwoFAService.loginWith2fa(
      userFound,
      userAgents,
      ip,
    );

    return new SuccessResponse({ data });
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: SuccessResponse,
  })
  @Public()
  @Post('forget-password')
  async forgetPassword(@Body() { phoneNumber, email }: ForgetPasswordDto) {
    const data = await this.forgetPasswordService.registerForgetPasswordCode({
      phoneNumber,
      email,
    });
    return new SuccessResponse({ data });
  }

  @ApiOperation({ summary: 'Verify forget password' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SuccessResponse,
  })
  @Public()
  @Post('forget-password/verify')
  async verifyForgetPassword(
    @Body() { phoneNumber, email, code }: VerifyForgetPasswordDto,
  ) {
    const data = await this.forgetPasswordService.verifyForgetPasswordCode({
      phoneNumber,
      email,
      code,
    });
    return new SuccessResponse({ data });
  }

  @Public()
  @ApiOperation({ summary: 'Change forget password (Set temporary-token)' })
  @ApiHeader({ name: 'temporary-token' })
  @UseGuards(ForgetPasswordTemporaryGuard)
  @Post('forget-password/change')
  async changeForgetPassword(
    @Req() { tempKey: userId },
    @Body() { password }: ChangeForgetPasswordDto,
  ) {
    const data = await this.forgetPasswordService.changeForgetPassword(
      password,
      userId,
    );
    return new SuccessResponse({ data });
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: SuccessResponse,
  })
  @ApiBearerAuth()
  @Post('password/change')
  async changePassword(
    @GetUser() user: UserEntity,
    @Body() { oldPassword, newPassword }: ChangePasswordDto,
  ) {
    const data = await this.authService.changePassword(user.id, {
      oldPassword,
      newPassword,
    });
    return new SuccessResponse({ data });
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: SuccessResponse,
  })
  @ApiBearerAuth()
  @Post('credential/change')
  async changeCredential(
    @GetUser() user: UserEntity,
    @Body() sendCode: ChangeCredentialSendCodeDto,
  ) {
    return new SuccessResponse({
      data: await this.authService.changeCredentials(user.id, sendCode),
    });
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: SuccessResponse,
  })
  @ApiBearerAuth()
  @Post('credential/verify')
  async verifyChangedCredential(
    @GetUser() user: UserEntity,
    @Body() verifyDto: ChangeCredentialVerifyDto,
  ) {
    return new SuccessResponse({
      data: await this.authService.verifyChangedCredentials(user.id, verifyDto),
    });
  }
}
