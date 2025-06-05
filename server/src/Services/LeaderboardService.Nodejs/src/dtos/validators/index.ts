import {InputData, Validator} from './types';
import {isPlainObj, plainObj} from './plain-obj';
import {RequestError} from '../../errors';
import {greaterThanZero} from './greater-than-zero';
import {nonEmptyStr} from './non-empty-str';
import {paramDecoratorFactory} from '../../utils/param-decorator-factory';

export const check = <T extends InputData>(...rules: Validator<T>[]) =>
  paramDecoratorFactory(data => {
    if (!isPlainObj(data)) {
      throw new RequestError('input data must be a plain object');
    }
    for (const rule of rules) rule(data as T);
  }, 'pipe');

export {greaterThanZero, nonEmptyStr, plainObj};
