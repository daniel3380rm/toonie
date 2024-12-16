import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseResponse } from 'src/common/dto/response/base-response.dto';
import { UserResponseDto } from 'src/domains/domain-auth/users/dto/user-response.dto';
import { GenderEnum } from '../../enums/gender.enum';

export class ProfileDto extends BaseResponse {
  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiPropertyOptional()
  birthDate?: Date;

  @ApiPropertyOptional({ type: UserResponseDto })
  user?: UserResponseDto;

  @ApiProperty()
  avatar?: string | null;

  @ApiProperty()
  gender: GenderEnum;

  @ApiProperty()
  zone: number;

  @ApiProperty()
  addressOne: string;

  @ApiProperty()
  addressTwo: string;

  @ApiProperty()
  occupation: string;

  @ApiProperty()
  postalCode: string;

  constructor(init?: Partial<ProfileDto>) {
    super(init);

    this.firstName = init?.firstName ? init?.firstName : null;
    this.lastName = init?.lastName ? init?.lastName : null;
    this.birthDate = init?.birthDate ? init?.birthDate : null;
    this.avatar = init?.avatar ? init?.avatar : null;
    this.gender = init?.gender ? init?.gender : null;
    this.zone = init?.zone ? init?.zone : null;
    this.addressOne = init?.addressOne ? init?.addressOne : null;
    this.addressTwo = init?.addressTwo ? init?.addressTwo : null;
    this.occupation = init?.occupation ? init?.occupation : null;
    this.postalCode = init?.postalCode ? init?.postalCode : null;
    this.user = init?.user ? new UserResponseDto(init.user) : null;
  }
}
