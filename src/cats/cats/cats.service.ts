import { Injectable } from '@nestjs/common';
import { Cat, CreateCatDto, DeleteCatDto } from '../../core/model';
import { appendJson, deleteJson, readJson } from '../../tools/read-json';
import { BadRequestException } from '../../common/exception/http-exception';

interface Result<T> {
  data: T;
}

@Injectable()
export class CatsService {
  create(cat: CreateCatDto) {
    const result = appendJson('/datas/data.json', {
      ...cat,
    });

    if (result.err) {
      throw new BadRequestException(result.err.message);
    }
    return { id: result.result.data };
  }

  findAll(): Promise<Cat[]> {
    const data = readJson('/datas/data.json');
    if (data.err) {
      throw new BadRequestException(data.err.message);
    }
    return data.result.data;
  }

  getOneById(id: number): Cat {
    const data = readJson('/datas/data.json');
    if (data.err) {
      throw new BadRequestException(data.err.message);
    }
    return data.result.data.find(v => v.id === id);
  }

  delete(param: DeleteCatDto) {
    console.warn(param);
    const data = deleteJson('/datas/data.json', param.id);
    if (data.err) {
      throw new BadRequestException(data.err.message);
    }

    return { id: param.id };
  }
}
