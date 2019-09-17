import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { resolveAny } from 'dns';
import { UserInfo } from '../core/model';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByUserName(username);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: UserInfo) {
    const payload = { username: user.username, email: user.email };
    return {
      token: this.jwtService.sign(payload),
    };
  }
}

export const jwtSecretKey = 'zw';
