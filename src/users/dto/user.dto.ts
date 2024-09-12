import { Expose, Type } from 'class-transformer';
import { IsString, IsEmail, IsDate, IsOptional } from 'class-validator';
import { AddressDto } from './address.dto';

export class UserDto {
  @Expose()
  @IsString()
  id: string;

  @Expose()
  @IsString()
  name: string;

  @Expose()
  @IsEmail()
  email: string;

  @Expose()
  @IsDate()
  birthDate: Date;

  @Expose()
  @IsOptional()
  @Type(() => AddressDto)
  addresses?: AddressDto[];
}
