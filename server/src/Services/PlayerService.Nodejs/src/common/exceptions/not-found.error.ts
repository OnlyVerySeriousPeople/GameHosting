import { DomainException } from './domain-exception';

export class DomainNotFoundError extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
