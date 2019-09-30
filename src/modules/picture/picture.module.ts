import { Module } from '@nestjs/common';
import { PictureController } from './controller/picture.controller';
import { PictureService } from './service/picture.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PictureEntity } from '../../core/entity/picture.entity';
import { MinioService } from '../../core/service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([PictureEntity]), AuthModule],
  controllers: [PictureController],
  providers: [PictureService, MinioService],
})
export class PictureModule {}
