import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from 'src/user/user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async postRegisterUser(@Body() registerUserDto: RegisterUserDto) {
    return await this.userService.registerUser(registerUserDto);
  }
}
