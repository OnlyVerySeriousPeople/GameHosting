import { DomainException } from '../domain-exception';

export abstract class ExceptionCreator {
  protected abstract createException(message: string): DomainException;

  public throwIfNull<T>(
    value: T,
    message: string,
  ): asserts value is NonNullable<T> {
    if (value === null || value === undefined) {
      throw this.createException(message);
    }
  }
}
