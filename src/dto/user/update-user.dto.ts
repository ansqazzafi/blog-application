import {
  IsString,
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  ValidateNested,
  IsObject,
  IsBoolean,
  MinLength,
} from 'class-validator';
import { UpdateUserAddress } from 'src/interfaces/user.interface';
import { Type } from 'class-transformer';

class UpdateUserAddressDto implements UpdateUserAddress {
  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  city?: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(6, { message: 'Password is too short. Minimum length is 6 characters' })
  password?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsPhoneNumber(null, { message: 'Invalid phone number format' })
  phoneNumber?: string;

  @IsOptional()
  @ValidateNested()
  @IsObject()
  @Type(() => UpdateUserAddressDto)
  address?: UpdateUserAddressDto; 

  @IsOptional()
  @IsBoolean()
  isAdmin?: boolean;

  @IsOptional()
  @IsBoolean()
  status?: boolean;
}
