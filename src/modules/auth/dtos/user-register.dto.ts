import { IsEmail, IsString, MinLength } from 'class-validator';

export class UserRegisterDto {
  @IsString()
  userName: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(5)
  password: string;
}
