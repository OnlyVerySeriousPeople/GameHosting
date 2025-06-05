import {InputData, Predicate, Validator} from './types';
import {RequestError} from '../../errors';

export const isPlainObj: Predicate = value =>
  typeof value === 'object' &&
  value !== null &&
  Object.prototype.toString.call(value) === '[object Object]';

export function plainObj<T extends InputData>(
  ...keys: (keyof T)[]
): Validator<T> {
  return data => {
    for (const key of keys) {
      if (!isPlainObj(data[key])) {
        throw new RequestError(`field ${String(key)} must be a plain object`);
      }
    }
  };
}
