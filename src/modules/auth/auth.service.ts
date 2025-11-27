import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import { UserRegisterDto } from './dtos/user-register.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private configService: ConfigService,
  ) {}

  generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000);
  }
  async sendMail(email: string, verificationCode: number) {}

  async register(body: UserRegisterDto) {
    const { userName, email, password } = body;
    try {
      const isExisitingUser = await this.userModel.exists({ email });
      if (isExisitingUser) {
        throw new UnauthorizedException('user with email alreadye exists');
      }
      const hashedPassword = await bcrypt.hash(
        password,
        Number(this.configService.get<string>('SALT_RNDS')),
      );
      const verificationCode = this.generateVerificationCode();

      await this.sendMail(email, verificationCode);

      const newUser = new this.userModel({
        userName,
        email,
        password: hashedPassword,
        verificationCode,
      });
      const user = await newUser.save();
      return {
        message: 'User Registered successfully',
        user,
      };
    } catch (error) {
      throw error;
    }
  }
}
