import {IsString, IsEmail, IsOptional, IsBoolean, IsNotEmpty, IsPhoneNumber , ValidateNested , ValidateIf } from 'class-validator';
import { LoginDtoInterface, RegisterDtoInterface } from 'src/interfaces/authentication.interface';
import { UserAddress } from 'src/interfaces/user.interface';
import { Type } from 'class-transformer';

export class UserAddressDto implements UserAddress {
  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  country: string;
}

export class RegisterDto implements RegisterDtoInterface {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsPhoneNumber(null)
  phoneNumber?: string;

  @IsBoolean()
  @IsOptional()
  status?: boolean = false;

  @ValidateNested()
  @Type(() => UserAddressDto)  
  @IsNotEmpty()
  address: UserAddressDto;

  @IsOptional()
  @IsString()
  refreshToken?: string;
}


export class LoginDto implements LoginDtoInterface{
  @ValidateIf(o => !o.email) 
  @IsString()
  @IsNotEmpty()
  username: string;

  @ValidateIf(o => !o.username) 
  @IsEmail()
  @IsNotEmpty()
  email: string;


  @IsString()
  @IsNotEmpty()
  password: string;
}
