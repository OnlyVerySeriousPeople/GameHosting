import {InputData, Predicate, Validator} from './types';

export const isNonEmptyStr: Predicate = value =>
  typeof value === 'string' && value !== '';

export function nonEmptyStr<T extends InputData>(
  ...keys: (keyof T)[]
): Validator<T> {
  return data => {
    for (const key of keys) {
      if (!isNonEmptyStr(data[key])) {
        throw new Error(`Field ${String(key)} must be a non-empty string.`);
      }
    }
  };
}
