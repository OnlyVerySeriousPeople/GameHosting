import {InternalError} from './internal_error';

export class RequestError extends InternalError {
  static readonly ERR_NAME: string = 'RequestError';
}
