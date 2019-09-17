import { PipeTransform, ArgumentMetadata, Injectable } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { BadRequestException } from '../exception/http-exception';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value, metadata: ArgumentMetadata) {
    const { metatype } = metadata;
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      let errMsg = '';
      for (const err of errors) {
        errMsg += err.constraints[Object.keys(err.constraints)[0]] + ';';
      }
      console.warn(errMsg);
      throw new BadRequestException(errMsg);
    }
    return value;
  }

  private toValidate(metatype): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.find(type => metatype === type);
  }
}
