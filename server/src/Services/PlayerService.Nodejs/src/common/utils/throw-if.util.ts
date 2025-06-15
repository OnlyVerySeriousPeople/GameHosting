import { DomainNotFoundError } from '../exceptions/not-found.error';
import { DomainInvalidArgumentError } from '../exceptions/invalid-argument.error';

export class ThrowIf {
  private static checkValue(value: any) {
    return value === null || value === undefined;
  }

  static notFound<T>(
    value: T,
    message: string,
  ): asserts value is NonNullable<T> {
    if (this.checkValue(value)) {
      throw new DomainNotFoundError(message);
    }
  }

  static invalidArgument<T>(
    value: T,
    message: string,
  ): asserts value is NonNullable<T> {
    if (this.checkValue(value)) {
      throw new DomainInvalidArgumentError(message);
    }
  }
}
