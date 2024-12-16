import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, Validate } from 'class-validator';
import { IsNotExist, IsExist } from 'src/common/validators';
import { Roles } from '../../authorization/roles/entities/role.entity';
import { IsString } from 'src/common/decorators/validation/default';
import { ParentDto } from '../../../../common/dto/base.dto';

export class UpdateUserDto extends ParentDto {
  @ApiProperty({ example: 'test1@example.com' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  @IsOptional()
  @Validate(IsNotExist, ['User'], {
    message: 'emailAlreadyExists',
  })
  // @IsEmail({})
  @IsString()
  email?: string | null;

  @ApiProperty({ example: '09121234567' })
  @IsOptional()
  @Validate(IsNotExist, ['User'], {
    message: 'phoneNumberAlreadyExists',
  })
  phoneNumber?: string | null;

  provider?: string;

  socialId?: string | null;

  @ApiProperty({ type: Roles })
  @Validate(IsExist, ['Role', 'id'], {
    message: 'roleNotExists',
  })
  roles?: Roles[] | null;
}
