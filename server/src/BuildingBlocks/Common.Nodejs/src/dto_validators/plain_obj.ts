import {Data, Predicate, Validator} from './types';
import {RequestError} from '../errors';
import {camelToSnake} from '../utils';

export const isPlainObj: Predicate = value =>
  typeof value === 'object' &&
  value !== null &&
  Object.prototype.toString.call(value) === '[object Object]';

export const plainObj =
  <T extends Data>(...keys: (keyof T)[]): Validator<T> =>
  data => {
    for (const key of keys) {
      if (!isPlainObj(data[key])) {
        throw new RequestError(
          `field ${camelToSnake(String(key))} must be a plain object`,
        );
      }
    }
  };
