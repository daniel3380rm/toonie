import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { IsNotExist } from 'src/common/validators';
import { ParentDto } from 'src/common/dto/base.dto';
import { IsNotEmpty } from 'src/common/decorators/validation/default';
import { IsPassword } from 'src/common/decorators/validation';

export class CreateUserWithUsernamePasswordDto extends ParentDto {
  @ApiProperty({ example: 'test' })
  @IsNotEmpty()
  @Validate(IsNotExist, ['User'], {
    message: 'usernameAlreadyExists',
  })
  username: string;

  @ApiProperty({ example: '1234' })
  @IsPassword()
  @IsNotEmpty()
  password: string;
}
