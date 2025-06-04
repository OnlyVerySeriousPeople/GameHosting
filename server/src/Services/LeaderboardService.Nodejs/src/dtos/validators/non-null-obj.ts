import {InputData, validatorFactory} from './utils/validator-factory';

export const nonNullObj = <T extends InputData>(...keys: (keyof T)[]) =>
  validatorFactory<T>((data: T) => {
    for (const key of keys) {
      const value = data[key];
      if (typeof value !== 'object' || value === null) {
        throw new Error(`Property "${String(key)}" must be a non-null object.`);
      }
    }
  });
