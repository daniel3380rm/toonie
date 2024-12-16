import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import { IsDate } from 'src/common/decorators/validation/default';
import { CustomIsString } from 'src/common/decorators/validation/is-not-empty-string.decorator';
import { IsExist } from 'src/common/validators/is-exists.validator';
import { GenderEnum } from '../../enums/gender.enum';

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'test' })
  @CustomIsString({ optional: true })
  @IsOptional()
  firstName?: string;

  @ApiPropertyOptional({ example: '' })
  @CustomIsString({ optional: true })
  @IsOptional()
  lastName?: string;

  @ApiPropertyOptional()
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  birthDate?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  avatar?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(GenderEnum)
  gender: GenderEnum;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  cityId: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  addressOne: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  addressTwo: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  occupation: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  postalCode: string;
}
