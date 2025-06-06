import {Data, Predicate, Validator} from './types';
import {RequestError} from '../../errors';
import {camelToSnake} from '../../utils/camel_to_snake';

export const isNonEmptyStr: Predicate = value =>
  typeof value === 'string' && value !== '';

export const nonEmptyStr =
  <T extends Data>(...keys: (keyof T)[]): Validator<T> =>
  data => {
    for (const key of keys) {
      if (!isNonEmptyStr(data[key])) {
        throw new RequestError(
          `field ${camelToSnake(String(key))} must be a non-empty string`,
        );
      }
    }
  };
