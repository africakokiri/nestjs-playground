import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto, RegisterDto } from 'src/user/user.dto';
import { Roles, UserModel } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  // JWT token 발급
  signJwtToken(email: string, role: Roles, isAccessToken: boolean) {
    const payload = {
      email,
      role,
    };

    return this.jwtService.sign(payload, {
      secret: 'kokiri',
      expiresIn: isAccessToken ? '15m' : '7days',
    });
  }

  // 로그인
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = (await this.userService.getUserByEmail(
      email,
    )) as UserModel;

    if (!user) {
      throw new BadRequestException('유저가 존재하지 않습니다.');
    }

    const passwordValidation = await bcrypt.compare(
      password,
      user.password,
    );

    if (!passwordValidation) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    }

    return {
      accessToken: this.signJwtToken(user.email, user.role, true),
      refreshToken: this.signJwtToken(user.email, user.role, false),
    };
  }

  // 회원가입
  async register(registerDto: RegisterDto) {
    const { email, nickname, password } = registerDto;

    if (await this.userService.checkExist('email', email)) {
      throw new ConflictException('이미 존재하는 이메일입니다.');
    }

    if (await this.userService.checkExist('nickname', nickname)) {
      throw new ConflictException('이미 존재하는 닉네임입니다.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await this.userService.createAndSaveUser({
      ...registerDto,
      password: hashedPassword,
    });

    return this.login({
      email,
      password,
    });
  }
}
