import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseResponse } from 'src/common/dto/response/base-response.dto';
import { RoleDto } from '../../authorization/roles/dto/role.dto';
import { User2FAType } from '../enums/user-2fa-type.enum';
import { UserProfile } from '../../../domain-member/user-profiles/entities/profile.entity';

export class UserResponseDto extends BaseResponse {
  @ApiPropertyOptional()
  email: string | null;

  @ApiProperty()
  phoneNumber: string;

  @ApiPropertyOptional()
  isEmailVerified?: boolean;

  @ApiPropertyOptional({ type: [RoleDto] })
  roles: RoleDto[];

  @ApiPropertyOptional({ type: [RoleDto] })
  twoFAType: User2FAType;

  @ApiProperty()
  referralCode: string;

  @ApiPropertyOptional()
  isAdmin?: boolean;

  @ApiPropertyOptional()
  isAdvisor?: boolean;

  @ApiPropertyOptional()
  haveProfile?: boolean;

  profile: UserProfile;
  constructor(init: Partial<UserResponseDto>) {
    super(init);

    this.email = init.email;
    this.phoneNumber = init.phoneNumber;
    this.referralCode = init.referralCode;
    this.isEmailVerified = init.isEmailVerified;
    this.twoFAType = init.twoFAType;
    this.isAdmin = init?.isAdmin;
    this.isAdvisor = init?.isAdvisor;
    this.roles =
      init.roles && init.roles.length
        ? init.roles.map((role) => new RoleDto(role))
        : [];
    this.haveProfile = !!init?.profile?.id;
  }
}
