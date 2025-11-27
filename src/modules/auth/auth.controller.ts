import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserRegisterDto } from './dtos/user-register.dto';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { RegisterResDto } from './dtos/register-res.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  @Serialize(RegisterResDto)
  register(@Body() body: UserRegisterDto) {
    return this.authService.register(body);
  }
}
