import { Injectable, PipeTransform } from '@nestjs/common';
import { validate } from 'class-validator';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { DomainInvalidArgumentError } from '../exceptions/invalid-argument.error';

@Injectable()
export class ValidateDtoPipe<T extends object> implements PipeTransform {
  constructor(private readonly dtoClass: ClassConstructor<T>) {}

  async transform(value: any): Promise<T> {
    const object = plainToInstance(this.dtoClass, value);
    const errors = await validate(object);

    if (errors.length > 0) {
      const message = errors
        .map((e) => Object.values(e.constraints ?? {}))
        .flat()
        .join('; ');
      throw new DomainInvalidArgumentError(message);
    }

    return object;
  }
}
