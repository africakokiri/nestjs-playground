import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserModel } from 'src/user/user.entity';
import { UserModule } from 'src/user/user.module';
import { Repository } from 'typeorm';
import { RegisterDto } from 'src/user/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserModel)
    private readonly userRepository: Repository<UserModule>,
  ) {}

  // email 또는 nickname이 이미 존재하는지 검증
  async checkExist(field: 'email' | 'nickname', target: string) {
    return await this.userRepository.exists({
      where: {
        [field]: target,
      },
    });
  }

  // 이메일로 유저 조회
  async getUserByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    return user;
  }

  // 유저 DB에 저장
  async createAndSaveUser(registerDto: RegisterDto) {
    const user = this.userRepository.create(registerDto);

    return await this.userRepository.save(user);
  }
}
