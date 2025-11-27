import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, VerificationCode } from 'src/schemas/user.schema';
import { UserRegisterDto } from './dtos/user-register.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import * as sgMail from '@sendgrid/mail';
import { VerificationCodeDto } from './dtos/verification-user.dto';
import { UserLoginDto } from './dtos/user-login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private configService: ConfigService,
  ) {}

  generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000);
  }
  async sendMail(email: string, verificationCode: number) {
    try {
      const apiKey = process.env.SG_APIKEY;

      if (!apiKey) {
        throw new Error('Missing SendGrid API Key (SG_APIKEY)');
      }
      sgMail.setApiKey(apiKey);

      await sgMail.send({
        to: email,
        from: process.env.SENDGRID_FROM_EMAIL!,
        subject: 'Verification Code',
        html: `<h1>Your verification code is ${verificationCode}</h1>`,
      });

      console.log('Email sent successfully via SendGrid v3');
    } catch (error) {
      console.error('Error sending email:', error);
      throw new InternalServerErrorException('Failed to send email');
    }
  }

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
        verificationCode: {
          code: verificationCode,
          date: Date.now(),
        },
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

  async verifyEmail(body: VerificationCodeDto) {
    const { email, code } = body;

    // 1️⃣ Find user by email
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.isVerified) {
      throw new BadRequestException('user already verified');
    }

    // 2️⃣ Check if verification code exists
    if (!user.verificationCode || !user.verificationCode.code) {
      throw new BadRequestException('No verification code found for this user');
    }

    // 3️⃣ Check if code matches
    if (user.verificationCode.code !== code) {
      throw new BadRequestException('Invalid verification code');
    }

    const now = new Date();
    const codeDate = user.verificationCode.date || new Date(0);
    const diffMinutes = (now.getTime() - codeDate.getTime()) / 1000 / 60;
    if (diffMinutes > 10) {
      throw new BadRequestException('Verification code expired');
    }

    // 5️⃣ Mark user as verified and remove verification code
    user.isVerified = true;
    user.verificationCode.code = 0;

    await user.save();

    return { message: 'Email verified successfully' };
  }

  async login(body: UserLoginDto) {
    const { email, password } = body;
    
  }
}
