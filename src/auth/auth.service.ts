import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UserInfo } from '../core/model';
import { CreateMD5 } from '../tools/createMD5';
import { BadRequestException } from '../common/exception/http-exception';
import { UserEntity } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByUserName(username);
    if (!user) {
      throw new BadRequestException('用户名不存在');
    }

    if (user && user.password === CreateMD5(pass, user.salt)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: UserEntity) {
    const payload = { username: user.name, email: user.email };
    console.warn(11, payload);
    return {
      token: this.jwtService.sign(payload),
    };
  }
}

export const jwtSecretKey = 'zw';
