import {
  Body,
  Controller,
  ForbiddenException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { OtpSendCodeDto } from '../dto/otp-send-code.dto';
import { UserErrors } from '../../users/enums/user-messages.enum';
import { UserPermissions } from '../../users/enums/user-permissions.enum';
import { AdminOtpVerifyDto } from '../dto/admin-otp-verify.dto';
import { GetReqId } from '../../../../common/decorators/get-req-id.decorator';
import { UserResponseDto } from '../../users/dto/user-response.dto';
import { AuthOtpService } from '../services/auth-otp.service';
import { PermissionGuard } from '../../authorization/permission/permission.guard';
import { UsersService } from '../../users/services/users.service';
import { PermissionType } from '../../authorization/permission/permission.decorator';
import { UserProfilesService } from '../../../domain-member/user-profiles/services/user-profiles.service';
import { OtpType } from '../enums/authentication-otp-type.enum';
import { SuccessResponse } from '../../../../common/dto/response/success.response';

@ApiTags('Admin User Authentication')
@ApiBearerAuth()
@UseGuards(PermissionGuard)
@Controller({
  path: 'admin/auth',
  version: '1',
})
export class AuthenticationAdminController {
  constructor(
    private usersService: UsersService,
    private authOtpService: AuthOtpService,
    private readonly profilesService: UserProfilesService,
  ) {}

  @PermissionType(UserPermissions.CREATE_USER)
  @Post('otp/code')
  async sendCode(@Body() { phoneNumber }: OtpSendCodeDto) {
    const { isExists } = await this.usersService.isExistsByPhoneNumber(
      phoneNumber,
    );
    if (isExists)
      throw new ForbiddenException(UserErrors.PHONE_NUMBER_DUPLICATED);
    const code = await this.authOtpService.setOtpVerification(
      OtpType.PHONE_NUMBER,
      phoneNumber,
    );
    const result = await this.authOtpService.sendOtpVerification(
      OtpType.PHONE_NUMBER,
      phoneNumber,
      code,
    );
    return new SuccessResponse({ data: { data: result } });
  }

  @PermissionType(UserPermissions.CREATE_USER)
  @Post('otp/verify')
  async verifyCode(
    @GetReqId() requestId: number,
    @Body() { phoneNumber, code, firstName, lastName }: AdminOtpVerifyDto,
  ) {
    const { isExists } = await this.usersService.isExistsByPhoneNumber(
      phoneNumber,
    );
    console.log(isExists);

    if (isExists)
      throw new ForbiddenException(UserErrors.PHONE_NUMBER_DUPLICATED);
    await this.authOtpService.isOtpVerificationCorrect(
      OtpType.PHONE_NUMBER,
      phoneNumber,
      code,
    );

    const userInstance = await this.usersService.createWithPhoneNumber({
      phoneNumber: phoneNumber,
    });
    console.log(userInstance);
    userInstance.profile = await this.profilesService.create({
      firstName,
      lastName,
      userId: userInstance.id,
    });
    return new SuccessResponse({
      data: { data: new UserResponseDto(userInstance) },
    });
  }
}
