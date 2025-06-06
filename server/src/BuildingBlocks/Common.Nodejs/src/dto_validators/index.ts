import {Data, Validator} from './types';
import {isPlainObj} from './plain_obj';
import {RequestError} from '../errors';
import {methodDecoratorFactory} from '../utils';

export * from './greater_than_zero';
export * from './non_empty_str';
export * from './plain_obj';

export const CheckReq = <T extends Data>(...rules: Validator<T>[]) =>
  methodDecoratorFactory(req => {
    if (!isPlainObj(req)) {
      throw new RequestError('input data must be a plain object');
    }
    for (const rule of rules) rule(req as T);
  });
