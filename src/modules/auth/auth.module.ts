import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService, jwtSecretKey } from './service/auth.service';
import { UsersModule } from '../users/users.module';
import { LocalStrategy } from './stragegy/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './stragegy/jwt.strategy';
import { AuthController } from './controller/auth.controller';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: jwtSecretKey,
      signOptions: { expiresIn: '1h' },
    })
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
