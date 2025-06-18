import { NotFoundExceptionCreator } from '../exceptions/factories/not-found-ex-creator';
import { InvalidArgumentExceptionCreator } from '../exceptions/factories/invalid-argument-ex-creator';

export class ThrowIf {
  private static notFoundCreator: NotFoundExceptionCreator =
    new NotFoundExceptionCreator();
  private static invalidArgumentCreator: InvalidArgumentExceptionCreator =
    new InvalidArgumentExceptionCreator();

  static notFound<T>(
    value: T,
    message: string,
  ): asserts value is NonNullable<T> {
    this.notFoundCreator.throwIfNull(value, message);
  }

  static invalidArgument<T>(
    value: T,
    message: string,
  ): asserts value is NonNullable<T> {
    this.invalidArgumentCreator.throwIfNull(value, message);
  }
}
