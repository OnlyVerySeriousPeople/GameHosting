import {Data, Predicate, Validator} from './types';
import {RequestError} from '../../errors';

export const isGreaterThanZero: Predicate = value =>
  (typeof value === 'number' || typeof value === 'bigint') && value > 0;

export const greaterThanZero =
  <T extends Data>(...keys: (keyof T)[]): Validator<T> =>
  data => {
    for (const key of keys) {
      if (!isGreaterThanZero(data[key])) {
        throw new RequestError(
          `field "${String(key)}" must be a number or bigint greater than zero`,
        );
      }
    }
  };
