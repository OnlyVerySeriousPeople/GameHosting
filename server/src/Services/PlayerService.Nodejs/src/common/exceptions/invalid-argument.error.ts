import { DomainException } from './domain-exception';

export class DomainInvalidArgumentError extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
