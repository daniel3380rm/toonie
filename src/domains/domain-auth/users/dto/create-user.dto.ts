import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsExist, IsNotExist } from 'src/common/validators';
import { Roles } from '../../authorization/roles/entities/role.entity';
import { Validate } from 'class-validator';
import { IsNotEmpty, IsString } from 'src/common/decorators/validation/default';
import { IsEmail } from 'src/common/decorators/validation/default/is-email.decorator';
import { MinLength } from 'src/common/decorators/validation/default/min-length.decorator';

export class CreateUserDto {
  @ApiProperty({ example: 'test1@example.com' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  @IsNotEmpty()
  @Validate(IsNotExist, ['User'], {
    message: 'emailAlreadyExists',
  })
  // @IsEmail({})
  @IsString()
  email?: string | null;

  @ApiProperty({ example: '09121234567' })
  @IsNotEmpty()
  @Validate(IsNotExist, ['User'], {
    message: 'phoneNumberAlreadyExists',
  })
  phoneNumber?: string | null;

  @ApiProperty({ example: 'test' })
  @IsNotEmpty()
  @Validate(IsNotExist, ['User'], {
    message: 'usernameAlreadyExists',
  })
  username?: string;

  @ApiProperty()
  @MinLength(6)
  password?: string;

  provider?: string;

  socialId?: string | null;

  @ApiProperty({ type: Roles })
  @Validate(IsExist, ['Role', 'id'], {
    message: 'roleNotExists',
  })
  roles?: Roles[] | null;
}
