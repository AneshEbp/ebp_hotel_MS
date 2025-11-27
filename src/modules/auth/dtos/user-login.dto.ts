import { IsEmail, IsString, MinLength } from 'class-validator';

export class UserLoginDto {
  @IsString()
  @IsEmail()
  email: string;

  @MinLength(5)
  @IsString()
  password: string;
}
