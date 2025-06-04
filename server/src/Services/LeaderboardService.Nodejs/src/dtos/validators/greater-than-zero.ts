import {InputData, validatorFactory} from './utils/validator-factory';

export const greaterThanZero = <T extends InputData>(...keys: (keyof T)[]) =>
  validatorFactory((data: T) => {
    for (const key of keys) {
      const value = data[key] as unknown;
      if (typeof value !== 'number' && typeof value !== 'bigint') {
        throw new Error(
          `Property "${String(key)}" must be a number or bigint.`,
        );
      }
      if (value <= 0)
        throw new Error(
          `Property "${String(key)}" must be a number or bigint greater than zero.`,
        );
    }
  });
