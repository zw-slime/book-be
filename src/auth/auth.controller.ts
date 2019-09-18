import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserDTO } from '../core/model';
import { BadRequestException } from '../common/exception/http-exception';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

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
  async addUser(@Body() user: UserDTO) {
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
}
