import {InternalError} from './internal_error';

const ERR_NAME = 'RequestError';

export class RequestError extends InternalError {
  override name = ERR_NAME;

  constructor(message = 'invalid request provided') {
    super(message);
  }

  static [Symbol.hasInstance](instance: unknown): boolean {
    return instance instanceof InternalError && instance.name === ERR_NAME;
  }
}
