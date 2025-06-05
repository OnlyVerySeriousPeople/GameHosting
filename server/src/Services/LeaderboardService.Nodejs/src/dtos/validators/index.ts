import {InputData, Validator} from './types';
import {isPlainObj, plainObj} from './plain_obj';
import {RequestError} from '../../errors';
import {greaterThanZero} from './greater_than_zero';
import {nonEmptyStr} from './non_empty_str';
import {paramDecoratorFactory} from '../../utils/param_decorator_factory';

export const check = <T extends InputData>(...rules: Validator<T>[]) =>
  paramDecoratorFactory(data => {
    if (!isPlainObj(data)) {
      throw new RequestError('input data must be a plain object');
    }
    for (const rule of rules) rule(data as T);
  });

export {greaterThanZero, nonEmptyStr, plainObj};
