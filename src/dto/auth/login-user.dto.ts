import { IsString, IsEmail, IsOptional, IsNotEmpty, ValidateIf, IsDefined } from 'class-validator';

export class LoginUserDto {
  
  @ValidateIf(o => !o.email) 
  @IsString()
  @IsNotEmpty({ message: 'Username is required' })
  username?: string;

  @ValidateIf(o => !o.username) 
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  email?: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}
