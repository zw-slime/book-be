import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('/api')
  getHello(): string {
    return 'hello';
  }
}
