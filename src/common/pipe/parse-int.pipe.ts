import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { BadRequestException } from '../exception/http-exception';

@Injectable()
export class ParseIntPipe implements PipeTransform<any> {
  async transform(value: string, metadata: ArgumentMetadata) {
    console.log(value);
    if (!/^[0-9]*$/.exec(value)) {
      throw new BadRequestException('param must be integer');
    }
    const val = parseInt(value, 10);
    if (isNaN(val)) {
      throw new BadRequestException('param must be integer');
    }
    return val;
  }
}
