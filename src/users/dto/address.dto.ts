import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class AddressDto {
  @IsNotEmpty({ message: 'Street is required.' })
  @IsString({ message: 'Street must be a string.' })
  street: string;

  @IsNotEmpty({ message: 'Number is required.' })
  @IsString({ message: 'Number must be a string.' })
  number: string;

  @IsOptional()
  @IsString({ message: 'Complement must be a string.' })
  complement?: string;

  @IsNotEmpty({ message: 'Neighborhood is required.' })
  @IsString({ message: 'Neighborhood must be a string.' })
  neighborhood: string;

  @IsNotEmpty({ message: 'City is required.' })
  @IsString({ message: 'City must be a string.' })
  city: string;

  @IsNotEmpty({ message: 'State is required.' })
  @IsString({ message: 'State must be a string.' })
  state: string;

  @IsOptional()
  @IsString({ message: 'ZipCode must be a string.' })
  zipCode?: string;
}
