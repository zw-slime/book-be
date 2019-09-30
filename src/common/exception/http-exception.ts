import { HttpException, HttpStatus } from '@nestjs/common';

export enum ErrorCode {
  jwtNotFound = 10110,
  jwtExpired = 10111,
  jwtInvalid = 10112,
  jwtNoUser = 10113,
  noPicturePermission = 10114,
}

export class BadRequestException extends HttpException {
  constructor(private readonly msg: string) {
    super(
      {
        errCode: HttpStatus.INTERNAL_SERVER_ERROR, // errMsg code
        errMsg: msg,
      },
      500, // errCode code
    );
  }
}

// jwt 过期
export class JwtException extends HttpException {
  constructor(private readonly errCode, private readonly msg) {
    super(
      {
        errCode,
        errMsg: msg,
      },
      403,
    );
  }
}

// 对图片没有权限
export class NOPicturePermissionException extends HttpException {
  constructor() {
    super(
      {
        errCode: ErrorCode.noPicturePermission,
        errMsg: '您对图片没有访问权限',
      },
      500,
    );
  }
}
