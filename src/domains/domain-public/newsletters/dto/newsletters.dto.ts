import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, Validate } from 'class-validator';
import { IsNotExist } from '../../../../common/validators';

export class NewslettersDto {
  @ApiProperty()
  @IsEmail({})
  @Validate(IsNotExist, ['NewslettersEntity'], {
    message: 'emailAlreadyExists',
  })
  email: string;
}
