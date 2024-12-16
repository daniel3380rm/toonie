import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsPassword } from 'src/common/decorators/validation';
import { CustomIsString } from 'src/common/decorators/validation/is-not-empty-string.decorator';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { IsDate, IsString } from 'src/common/decorators/validation/default';
import { Type } from 'class-transformer';
import { GenderEnum } from '../../enums/gender.enum';

export class CreateProfileDto {
  @ApiProperty({ example: 'firstName' })
  @CustomIsString()
  @IsOptional()
  firstName: string;

  @ApiProperty({ example: 'lastName' })
  @CustomIsString()
  @IsOptional()
  lastName: string;

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
