import { Expose, Type } from 'class-transformer';

class UserResDto {
  @Expose()
  userName: string;

  @Expose()
  email: string;
}

export class RegisterResDto {
  @Expose()
  message: string;

  @Expose()
  @Type(() => UserResDto)
  user: UserResDto;
}
