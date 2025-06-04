import {isPlainRecord} from '../../../utils/is-plain-record';
import {methodDecoratorFactory} from '../../../utils/method-decorator-factory';

export type InputData = Record<string, unknown>;

export const validatorFactory = <T extends InputData>(
  validate: (data: T) => void,
) =>
  methodDecoratorFactory((...args: unknown[]) => {
    const [first] = args;
    if (!isPlainRecord(first)) {
      throw new Error('Input data must be a plain object.');
    }
    validate(first as T);
  });
