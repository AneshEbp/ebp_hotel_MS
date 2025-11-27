import { IsEmail, IsNumber, IsString } from 'class-validator';

export class VerificationCodeDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsNumber()
  code: number;
}
