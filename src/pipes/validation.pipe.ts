import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ValidationException } from 'exceptions/validation.exception';

@Injectable()
export class ValidationPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    const obj = plainToInstance(metadata.metatype, value);
    const errors = await validate(obj);
    console.log('errors', errors.length, errors, obj);
    if (errors.length) {
      const messages = errors.map(
        (err) =>
          `${err.property}: ${Object.values(err.constraints).join(', ')}`,
      );
      throw new ValidationException(messages);
    }
    return value;
  }
}
