import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PictureEntity } from '../../../core/entity/picture.entity';
import { Repository } from 'typeorm';
import { AddPictureParams } from '../../../core/model/picture.model';
import {
  BadRequestException,
  NOPicturePermissionException,
} from '../../../common/exception/http-exception';
import { BucketName } from '../../../core/service';
import { AuthService } from '../../auth/service/auth.service';

@Injectable()
export class PictureService {
  constructor(
    @InjectRepository(PictureEntity)
    private readonly pictureRepository: Repository<PictureEntity>,
    private readonly authService: AuthService,
  ) {}

  async addPicture(params: AddPictureParams) {
    try {
      return await this.pictureRepository.save({
        owner: {
          id: params.userId,
        },
        fileName: params.fileName,
        bucketName: BucketName,
        fileType: params.fileType,
        originName: params.originName,
      });
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async findPictureByFileName(fileName: string) {
    try {
      return await this.pictureRepository.find({
        where: { fileName },
        relations: ['owner'],
      });
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async deletePictureByFileName(fileName: string) {
    try {
      return await this.pictureRepository.delete({ fileName });
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  // 查询pic数据库判断用户对图片有没有权限
  canReadPicture(fileName: string, authorization: string) {
    return new Promise(async (resolve, reject) => {
      const temp = authorization.split(' ');
      const userId = (this.authService.decode(temp[temp.length - 1]) as any)
        .userId;

      const pic = await this.findPictureByFileName(fileName);

      if (!pic || pic.length <= 0) {
        return reject(new BadRequestException('该文件不存在'));
      }
      if (pic[0].owner.id !== userId && !pic[0].isPublic) {
        return reject(new NOPicturePermissionException());
      }
      return resolve(pic);
    });
  }

  // 根据userId查询picture list
  async findMyPictureList(authorization: string) {
    const temp = authorization.split(' ');
    const userId = (this.authService.decode(temp[temp.length - 1]) as any)
      .userId;

    try {
      return await this.pictureRepository.find({ owner: { id: userId } });
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}
