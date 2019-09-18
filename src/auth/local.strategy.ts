import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';
import { BadRequestException } from '../common/exception/http-exception';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    if (!username || !password) {
      throw new BadRequestException('请用户名和密码');
    }

    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new BadRequestException('用户名或者密码不正确');
    }
    return user;
  }
}
