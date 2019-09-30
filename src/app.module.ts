import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

import { AppController } from './app.controller';

import { CatsModule } from './modules/cats/cats.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';

import { HttpExceptionFilter } from './common/exception/http-exception.filter';
import { ValidationPipe } from './common/pipe/validation.pipe';
import { TransformInterceptor } from './common/interceptor/transform.interceptor';
import { JwtAuthGuard } from './common/guard/jwtAuth.guard';
import { BadRequestException } from './common/exception/http-exception';
import { PictureModule } from './modules/picture/picture.module';

@Module({
  imports: [
    CatsModule,
    AuthModule,
    UsersModule,
    TypeOrmModule.forRoot({
      keepConnectionAlive: true,
      type: 'mysql',
      host: '192.168.44.90',
      port: 3305,
      username: 'root',
      password: '123456',
      database: 'book-be',
      synchronize: true,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
    }),
    PictureModule,
  ],
  controllers: [AppController],
  providers: [
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
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor, // 拦截器
    },
  ],
})
export class AppModule {
  constructor(private readonly connection: Connection) {
    if (!connection.isConnected) {
      throw new BadRequestException('数据库连接失败');
    }
    console.warn(connection.isConnected ? '数据库连接成功' : '数据库连接失败');
  }
}
