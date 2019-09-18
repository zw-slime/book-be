import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { ErrorCode, JwtException } from '../exception/http-exception';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    if (request.url === '/auth/login' || request.url === '/auth/register') {
      return true;
    } else {
      return super.canActivate(context);
    }
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      if (info) {
        if (info.message === 'jwt expired') {
          throw new JwtException(ErrorCode.jwtExpired, info.message);
        } else if (info.message === 'No auth token') {
          throw new JwtException(ErrorCode.jwtNotFound, info.message);
        } else {
          throw new JwtException(ErrorCode.jwtInvalid, info.message);
        }
      } else {
        throw new JwtException(ErrorCode.jwtNoUser, err.msg);
      }
    }
    return user;
  }
}
