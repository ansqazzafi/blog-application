import { Type } from 'class-transformer';
import { IsString, IsEmail, IsBoolean, IsOptional, ValidateNested,  IsNotEmpty, MinLength, IsObject } from 'class-validator';
import { RegisterUserAddress } from 'src/interfaces/user.interface';

 class RegisterUserAddressDto implements RegisterUserAddress{
    @IsString()
    @IsNotEmpty()
    country: string;
  
    @IsString()
    @IsNotEmpty()
    city: string;
  }

export class RegisterUserDto {

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
    @MinLength(6, { message: 'Password is too short. Minimum length is 6 characters' })
    password: string;

    @IsOptional()
    @IsString()
    bio?: string;

    @IsOptional()
    @IsString()
    phoneNumber?: string;

    @ValidateNested()
    @IsObject()
    @Type(() => RegisterUserAddressDto)
    address: RegisterUserAddressDto;

    @IsBoolean()
    @IsOptional()
    isAdmin?: boolean;

    @IsBoolean()
    @IsOptional()
    status?: boolean;
}
