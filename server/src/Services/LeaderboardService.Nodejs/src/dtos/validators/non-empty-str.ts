import {InputData, validatorFactory} from './utils/validator-factory';

export const nonEmptyStr = <T extends InputData>(...keys: (keyof T)[]) =>
  validatorFactory<T>((data: T) => {
    for (const key of keys) {
      const value = data[key];
      if (typeof value !== 'string' || value === '') {
        throw new Error(`Property ${String(key)} must be a non-empty string.`);
      }
    }
  });
