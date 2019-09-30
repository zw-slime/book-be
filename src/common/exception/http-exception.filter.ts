import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus();
    console.warn(exception);
    response.status(status).json({
      meta: {
        err_code: exception.message.errCode,
        err_msg: exception.message.errMsg,
        timestamp: new Date().toISOString(),
        path: request.url,
      },
      data: null,
    });
  }
}
