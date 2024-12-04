import { PickType } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserModel } from 'src/user/user.entity';

export class RegisterDto extends PickType(UserModel, [
  'email',
  'nickname',
  'password',
]) {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(4)
  @MaxLength(12)
  nickname: string;

  @IsString()
  @MinLength(8)
  @MaxLength(16)
  password: string;
}

export class LoginDto extends PickType(RegisterDto, [
  'email',
  'password',
]) {}
