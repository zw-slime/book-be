import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import * as multer from 'multer';
import * as hash from 'object-hash';
import { Response } from 'express';

import { MinioService } from '../../../core/service';
import { PictureService } from '../service/picture.service';
import * as fs from 'fs';
import { Stream } from 'stream';
import {
  BadRequestException,
  NOPicturePermissionException,
} from '../../../common/exception/http-exception';
import { AuthService } from '../../auth/service/auth.service';
import { UserInfo } from '../../../core/model';
import { DeletePictureValidator } from '../../../core/class-validator/picture.validator';

@Controller('picture')
export class PictureController {
  constructor(
    private readonly pictureSerive: PictureService,
    private readonly minioService: MinioService,
    private readonly authService: AuthService,
  ) {}

  // @Post('upload')
  // @UseInterceptors(
  //   FileInterceptor('file', {
  //     dest: path.join(__dirname, '../../../public'),
  //     storage: multer.diskStorage({
  //       destination: (req, file, cb) => {
  //         cb(null, path.join(__dirname, '../../../public'));
  //       },
  //       filename(
  //         req: Express.Request,
  //         file: Express.Multer.File,
  //         callback: (error: Error | null, filename: string) => void,
  //       ): void {
  //         let type = '';
  //         if (file.originalname.indexOf('.') > -1) {
  //           const arr = file.originalname.split('.');
  //           type = arr[arr.length - 1];
  //         }
  //         const newFileName = hash({
  //           name: file.originalname,
  //           time: new Date().getTime(),
  //         });
  //         callback(null, newFileName + '.' + type);
  //       },
  //     }),
  //   }),
  // )
  // async uploadFile(@UploadedFile() file) {
  //   console.warn(file);
  //   await this.minioService.createObjet(
  //     file.filename,
  //     file.path,
  //     file.mimetype,
  //   );
  //   return file;
  // }

  @Post('upload-file')
  @UseInterceptors(FileInterceptor('file'))
  async uploadMinio(@UploadedFile() file, @Req() req) {
    const temp = req.header('authorization').split(' ');
    const userId = (this.authService.decode(temp[temp.length - 1]) as any)
      .userId;

    const fileHash = hash({
      name: file.originalname,
      time: new Date().getTime(),
    });

    await this.minioService.uploadFile(fileHash, file.buffer, file.mimetype);

    await this.pictureSerive.addPicture({
      userId,
      fileName: fileHash,
      fileType: file.mimetype,
      originName: file.originalname,
    });

    return { fileName: fileHash };
  }

  @Get('list')
  async findAllPicture(@Req() req) {
    return await this.pictureSerive.findMyPictureList(
      req.header('authorization'),
    );
  }

  @Get('/:id')
  async get(@Param('id') id: string, @Res() res: Response, @Req() req) {
    // 查询pic数据库判断用户对图片有没有权限
    const pic = await this.pictureSerive.canReadPicture(
      id,
      req.header('authorization'),
    );

    // 获取文具后缀名
    let ext = '';
    if (pic[0].originName.indexOf('.') > -1) {
      ext = pic[0].originName.split('.')[
        pic[0].originName.split('.').length - 1
      ];
    }

    // 返回文件下载流
    const readerStream = await this.minioService.getObject(id);

    readerStream.on('data', chunk => {
      res.write(chunk, 'binary');
    });
    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': 'attachment; filename=' + id + '.' + ext,
    });
    readerStream.on('end', () => {
      res.end();
    });
    readerStream.on('error', err => {
      console.log(err.stack);
      throw new BadRequestException(err.stack);
    });
  }

  @Post('delete')
  async delete(@Body() param: DeletePictureValidator, @Req() req) {
    // 查询pic数据库判断用户对图片有没有权限
    const pic = await this.pictureSerive.canReadPicture(
      param.fileName,
      req.header('authorization'),
    );
    await this.pictureSerive.deletePictureByFileName(param.fileName);

    await this.minioService.deleteObject(param.fileName);
    return { fileName: param.fileName };
  }
}
