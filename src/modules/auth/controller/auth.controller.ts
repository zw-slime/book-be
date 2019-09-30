import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BadRequestException } from '../../../common/exception/http-exception';
import { AuthService } from '../service/auth.service';
import { UsersService } from '../../users/service/users.service';
import {
  ChangeWordValidator,
  UserValidator,
} from '../../../core/class-validator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  // 登陆
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Req() req) {
    return this.authService.login(req.user);
  }

  // 注册
  @Post('register')
  async addUser(@Body() user: UserValidator) {
    try {
      const data = await this.usersService.addUser(user);
      return { name: data.name, email: data.email };
    } catch (e) {
      console.warn(e);
      throw new BadRequestException(e.message);
    }
  }

  @Get('me')
  getProfile(@Req() req) {
    return req.user;
  }

  // 更改密码
  @Post('change-password')
  async changePassword(@Req() req, @Body() params: ChangeWordValidator) {
    const temp = req.header('authorization').split(' ');
    const userId = (this.authService.decode(temp[temp.length - 1]) as any)
      .userId;
    try {
      const data = await this.usersService.updateUser({
        password: params.password,
        id: userId,
      });
      return { id: userId };
    } catch (e) {
      console.warn(e);
      throw new BadRequestException(e.message);
    }
  }
}
