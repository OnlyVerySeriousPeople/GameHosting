import { ExceptionCreator } from './exception-creator';
import { DomainException } from '../domain-exception';
import { DomainInvalidArgumentError } from '../invalid-argument.error';

export class InvalidArgumentExceptionCreator extends ExceptionCreator {
  protected createException(message: string): DomainException {
    return new DomainInvalidArgumentError(message);
  }
}
