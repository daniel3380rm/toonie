import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { IsNotExist } from 'src/common/validators';
import { ParentDto } from 'src/common/dto/base.dto';
import { IsNotEmpty } from 'src/common/decorators/validation/default';

export class CreateUserWithPhoneNumberDto extends ParentDto {
  @ApiProperty({ example: '09121234567' })
  @IsNotEmpty()
  @Validate(IsNotExist, ['User'], {
    message: 'phoneNumberAlreadyExists',
  })
  phoneNumber: string;
}
