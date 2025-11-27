import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserRegisterDto } from './dtos/user-register.dto';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { RegisterResDto } from './dtos/register-res.dto';
import { VerificationCodeDto } from './dtos/verification-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  @Serialize(RegisterResDto)
  register(@Body() body: UserRegisterDto) {
    return this.authService.register(body);
  }

  @Post('/verify')
  verifyEmail(@Body() body: VerificationCodeDto) {
    return this.authService.verifyEmail(body);
  }
}
