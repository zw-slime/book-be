import * as Minio from 'minio';
import { Client, ClientOptions } from 'minio';
import { BadRequestException } from '../../common/exception/http-exception';
import { Injectable } from '@nestjs/common';

export const BucketName = 'test';

@Injectable()
export class MinioService {
  private options: ClientOptions;
  private minioClient: Client;

  initial() {
    this.minioClient = new Minio.Client({
      ...this.options,
      endPoint: '192.168.44.90',
      port: 9000,
      useSSL: false,
      accessKey: 'TEST',
      secretKey: 'TEST123456',
    });
  }

  createBucket() {
    return new Promise((resolve, reject) => {
      this.minioClient.makeBucket(BucketName, 'us-east-1', err => {
        if (err) {
          reject(err);
          throw new BadRequestException(err.message);
        } else {
          resolve('success');
        }
      });
    });
  }

  async createObjet(objectName, filePath, type) {
    this.initial();
    if (!this.minioClient.bucketExists(BucketName)) {
      await this.createBucket();
    }

    const metaData = {
      'Content-Type': type,
    };
    console.warn(BucketName, objectName, filePath);
    try {
      return await this.minioClient.fPutObject(
        BucketName,
        objectName,
        filePath,
        metaData,
      );
    } catch (e) {
      console.warn(e);
      throw new BadRequestException(e.message);
    }
  }

  async uploadFile(fileName, file: Buffer, type) {
    this.initial();
    if (!this.minioClient.bucketExists(BucketName)) {
      await this.createBucket();
    }
    const metaData = {
      'Content-Type': type,
    };
    try {
      return await this.minioClient.putObject(
        BucketName,
        fileName,
        file,
        1024,
        metaData,
      );
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  getUrl(fileName): Promise<string> {
    console.warn(111, fileName);
    return new Promise((resolve, reject) => {
      this.initial();
      this.minioClient.presignedUrl(
        'GET',
        BucketName,
        fileName,
        24 * 60 * 60,
        (err, presignedUrl) => {
          console.warn(presignedUrl);
          if (err) {
            reject(err.message);
            throw new BadRequestException(err.message);
          }
          resolve(presignedUrl);
        },
      );
    });
  }

  async getObject(fileName) {
    this.initial();
    try {
      return await this.minioClient.getObject(BucketName, fileName);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async deleteObject(fileName) {
    this.initial();
    try {
      return await this.minioClient.removeObject(BucketName, fileName);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}
