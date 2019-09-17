import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
// tslint:disable-next-line:no-var-requires
const Ajv = require('ajv');

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private readonly schema) {}

  transform(value: any, metadata: ArgumentMetadata) {
    const ajv = new Ajv();
    console.warn(value);
    const valid = ajv.validate(this.schema, value);

    if (!valid) {
      throw new BadRequestException(
        ajv.errors[0].keyword + ' ' + ajv.errors[0].message,
      );
    }

    return value;
  }
}
