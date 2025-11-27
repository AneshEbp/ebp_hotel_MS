import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class VerificationCode {
  @Prop()
  code: number;

  @Prop()
  date: Date;
}

export const VerificationCodeSchema =
  SchemaFactory.createForClass(VerificationCode);

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  userName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ required: true })
  password: string;

  @Prop()
  phone: string;

  @Prop()
  address: string;

  @Prop({ default: 'user', enum: ['admin', 'user', 'hotel'] })
  role: string;

  @Prop({ type: VerificationCodeSchema })
  verificationCode: VerificationCode;

  @Prop()
  jti: string;
}
export const userSchema = SchemaFactory.createForClass(User);
