import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users/service/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateMD5 } from '../../../tools/createMD5';
import { BadRequestException } from '../../../common/exception/http-exception';
import { UserEntity } from '../../../core/entity';

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
    const payload = { userId: user.id, username: user.name };
    return {
      token: this.jwtService.sign(payload),
    };
  }

  decode(token: string) {
    return this.jwtService.decode(token);
  }
}

export const jwtSecretKey = 'zw';
