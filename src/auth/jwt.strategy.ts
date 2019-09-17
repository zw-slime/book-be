import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtSecretKey } from './auth.service';
import { UserInfo } from '../core/model';
import { UsersService } from '../users/users.service';
import { BadRequestException } from '../common/exception/http-exception';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecretKey,
    });
  }

  async validate(payload: UserInfo) {
    const user = await this.usersService.findOneByUserName(payload.username);
    if (!user) {
      throw new BadRequestException('用户名不存在');
    }
    return { username: payload.username, email: payload.email };
  }
}
