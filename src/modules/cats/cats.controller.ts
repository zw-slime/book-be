import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Redirect,
  Req, UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';
import { CatsService } from './cats/cats.service';
import { Cat, CreateCatDto, DeleteCatDto } from '../../core/model';
import { ParseIntPipe } from '../../common/pipe/parse-int.pipe';
import { LoggingInterceptor } from '../../common/interceptor/logging.interceptor';

// nest g controller cats

@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Get()
  @Redirect('https://docs.nestjs.com', 302)
  getDocs(@Req() request: Request) {
    return { url: 'https://docs.nestjs.com/v5/' };
  }

  @Get('get-one/:id') // 差点被坑死了 实际请求地址是 get-one/1
  async findCatById(@Param('id', new ParseIntPipe()) id) {
    return await this.catsService.getOneById(id);
  }

  @Get('get-all')
  async findAll(): Promise<Cat[]> {
    return await this.catsService.findAll();
  }

  @Post('create')
  async create(@Body() createCatDto: CreateCatDto) {
    return await this.catsService.create(createCatDto);
  }

  @Post('delete')
  async delete(@Body() deleteCatDto: DeleteCatDto) {
    return await this.catsService.delete(deleteCatDto);
  }
}
