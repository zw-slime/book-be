import { HttpException, HttpStatus } from '@nestjs/common';

export enum ErrorCode {
  jwtNotFound = 10110,
  jwtExpired = 10111,
  jwtInvalid = 10112,
  jwtNoUser = 10113,
}

export class BadRequestException extends HttpException {
  constructor(private readonly msg: string) {
    super(
      {
        status: HttpStatus.INTERNAL_SERVER_ERROR, // error code
        error: msg,
      },
      500, // status code
    );
  }
}

// jwt 过期
export class JwtException extends HttpException {
  constructor(private readonly errCode, private readonly msg) {
    super(
      {
        status: errCode,
        error: msg,
      },
      403,
    );
  }
}

export class ForbiddenException extends HttpException {
  constructor(private readonly msg: string) {
    super(
      {
        status: HttpStatus.FORBIDDEN,
        error: msg,
      },
      403,
    );
  }
}

export class NotFountexception extends HttpException {
  constructor(private readonly msg: string) {
    super(
      {
        status: HttpStatus.NOT_FOUND,
        error: msg,
      },
      404,
    );
  }
}
