import {InternalError} from './internal-error';

export class DatabaseError extends InternalError {
  override name = 'DatabaseError';

  constructor(message = 'database operation failed') {
    super(message);
  }

  static [Symbol.hasInstance](instance: unknown): boolean {
    return (
      instance instanceof InternalError && instance.name === 'DatabaseError'
    );
  }
}
