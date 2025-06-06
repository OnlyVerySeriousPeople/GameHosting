import {InternalError} from './internal_error';

const ERR_NAME = 'DatabaseError';

export class DatabaseError extends InternalError {
  override name = ERR_NAME;

  constructor(message = 'database operation failed') {
    super(message);
  }

  static [Symbol.hasInstance](instance: unknown): boolean {
    return instance instanceof InternalError && instance.name === ERR_NAME;
  }
}
