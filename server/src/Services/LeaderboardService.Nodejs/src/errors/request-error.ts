import {InternalError} from './internal-error';

export class RequestError extends InternalError {
  override name = 'RequestError';

  constructor(message = 'invalid request provided') {
    super(message);
  }

  static [Symbol.hasInstance](instance: unknown): boolean {
    return (
      instance instanceof InternalError && instance.name === 'RequestError'
    );
  }
}
