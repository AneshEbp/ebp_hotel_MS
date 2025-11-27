import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Observable } from 'rxjs';
import { User } from 'src/schemas/user.schema';

export class VerifiedGuard implements CanActivate {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { email } = request.body;
    if (!email) {
      throw new ForbiddenException('Email is required');
    }

    // Query the database directly
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new ForbiddenException('User not found');
    }
    if (!user.isVerified) {
      throw new ForbiddenException('User email not verified');
    }

    return true;
  }
}
