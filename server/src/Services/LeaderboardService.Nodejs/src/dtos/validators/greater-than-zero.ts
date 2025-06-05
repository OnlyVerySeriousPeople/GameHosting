import {InputData, Predicate, Validator} from './types';

export const isGreaterThanZero: Predicate = value =>
  (typeof value === 'number' || typeof value === 'bigint') && value > 0;

export function greaterThanZero<T extends InputData>(
  ...keys: (keyof T)[]
): Validator<T> {
  return data => {
    for (const key of keys) {
      if (!isGreaterThanZero(data[key])) {
        throw new Error(
          `Property "${String(key)}" must be a number or bigint greater than zero.`,
        );
      }
    }
  };
}
