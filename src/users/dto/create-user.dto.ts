import {
  IsString,
  IsEmail,
  IsArray,
  IsDate,
  IsOptional,
  IsNotEmpty,
  Length,
  ValidateNested,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { AddressDto } from './address.dto';

export class CreateUserDto {
  @IsNotEmpty()
  @Length(3, 100, { message: 'Name must be between 3 and 100 characters' })
  @IsString()
  name: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => AddressDto)
  addresses?: AddressDto[];

  @IsEmail()
  @Transform(({ value }) => value?.toLowerCase(), { toClassOnly: false })
  email: string;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  birthDate: Date;
}
