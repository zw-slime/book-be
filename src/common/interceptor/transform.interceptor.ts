import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { transform } from '@babel/core';

export interface Response<T> {
  data: T;
  meta: {
    err_code: number;
    err_msg: string;
    timestamp: string;
    path: string;
  };
}

// 转化请求结果
@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<Response<T>> | Promise<Observable<Response<T>>> {
    console.log('transform...');
    return next.handle().pipe(
      map(data => ({
        data,
        meta: {
          err_code: null,
          err_msg: null,
          timestamp: new Date().toISOString(),
          path: null,
        },
      })),
    );
  }
}
