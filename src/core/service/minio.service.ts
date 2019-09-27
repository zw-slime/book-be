import * as Minio from 'minio';
import { Client, ClientOptions } from 'minio';

export class MinioService {
  options: ClientOptions;
  minioClient: Client;

  constructor(private opts: ClientOptions) {
    this.options = opts;
    this.initial();
  }

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

  createBucket(bucketName) {
    return new Promise((resolve, reject) => {
      this.minioClient.makeBucket(bucketName, 'us-east-1', err => {
        if (err) {
          reject(err);
        } else {
          resolve('success');
        }
      });
    });
  }

  isExistsBucket(bucketName) {
    return new Promise((resolve, reject) => {
      this.minioClient.bucketExists(bucketName)
    });
  }
}
