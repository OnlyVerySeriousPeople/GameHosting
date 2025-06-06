import {InternalError} from './internal_error';

export class DatabaseError extends InternalError {
  static readonly ERR_NAME: string = 'DatabaseError';
}
