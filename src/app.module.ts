import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsController } from './cats/cats.controller';
import { CatsService } from './cats/cats/cats.service';
import { CatsModule } from './cats/cats.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { HttpExceptionFilter } from './common/exception/http-exception.filter';
import { ValidationPipe } from './common/pipe/validation.pipe';
import { RoleGuard } from './common/guard/role.guard';
import { ExceptionInterceptor } from './common/interceptor/exception.interceptor';
import { TransformInterceptor } from './common/interceptor/transform.interceptor';
import { LoggingInterceptor } from './common/interceptor/logging.interceptor';
import { ExcludeNillInterceptor } from './common/interceptor/excludeNill.interceptor';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { JwtAuthGuard } from './common/guard/jwtAuth.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import ormconfig from '../ormconfig';

@Module({
  imports: [
    CatsModule,
    AuthModule,
    UsersModule,
    TypeOrmModule.forRoot(ormconfig),
  ],
  controllers: [AppController, CatsController],
  providers: [
    AppService,
    CatsService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter, // 异常过滤器
    },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe, // 请求参数格式验证
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard, // 路由守卫
    },
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: LoggingInterceptor, // 拦截器
    // },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor, // 拦截器
    },
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: ExcludeNillInterceptor, // 拦截器
    // },
  ],
})
// export class AppModule implements NestModule {
//   configure(consumer: MiddlewareConsumer): any {
//     consumer
//       .apply(LoggerMiddleware)
//       .forRoutes({ path: '*', method: RequestMethod.ALL });
//   }
// }
export class AppModule {
  constructor(private readonly connection: Connection) {
    console.warn(__dirname);
    console.warn(connection.isConnected ? '数据库连接成功' : '数据库连接失败');
  }
}
