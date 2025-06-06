import {Data, Validator} from './types';
import {isPlainObj, plainObj} from './plain_obj';
import {RequestError} from '../../errors';
import {greaterThanZero} from './greater_than_zero';
import {methodDecoratorFactory} from '../../utils/method_decorator_factory';
import {nonEmptyStr} from './non_empty_str';

const CheckReq = <T extends Data>(...rules: Validator<T>[]) =>
  methodDecoratorFactory(req => {
    if (!isPlainObj(req)) {
      throw new RequestError('input data must be a plain object');
    }
    for (const rule of rules) rule(req as T);
  });

export {CheckReq, greaterThanZero, nonEmptyStr, plainObj};
