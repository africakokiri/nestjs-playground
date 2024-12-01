import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterUserDto } from 'src/user/user.dto';
import { UserModel } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserModel)
    private readonly userRepository: Repository<UserModel>,
  ) {}

  // 이메일로 유저 조회
  async getUserByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    return user;
  }

  // 이메일 또는 닉네임이 이미 존재하는지 확인
  async checkEmailOrNicknameExist(target: string) {
    return await this.userRepository.exists({
      where: {
        [target.includes('@') ? 'email' : 'nickname']: target,
      },
    });
  }

  // 유저 정보 DB에 저장
  async createAndSaveUser(registerUserDto: RegisterUserDto) {
    const user = this.userRepository.create(registerUserDto);

    return await this.userRepository.save(user);
  }

  // 회원가입
  async registerUser(registerUserDto: RegisterUserDto) {
    const { email, nickname, password } = registerUserDto;

    if (await this.checkEmailOrNicknameExist(email)) {
      throw new BadRequestException('이미 존재하는 이메일입니다.');
    }

    if (await this.checkEmailOrNicknameExist(nickname)) {
      throw new BadRequestException('이미 존재하는 닉네임입니다.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return await this.createAndSaveUser({
      ...registerUserDto,
      password: hashedPassword,
    });
  }
}
