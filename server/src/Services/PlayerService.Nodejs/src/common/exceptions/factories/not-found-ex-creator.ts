import { ExceptionCreator } from './exception-creator';
import { DomainException } from '../domain-exception';
import { DomainNotFoundError } from '../not-found.error';

export class NotFoundExceptionCreator extends ExceptionCreator {
  protected createException(message: string): DomainException {
    return new DomainNotFoundError(message);
  }
}
