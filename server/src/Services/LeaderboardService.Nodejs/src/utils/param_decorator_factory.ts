import {Fn} from './types';

export function paramDecoratorFactory(
  decorator: (arg: unknown) => unknown,
  mode?: 'pipe',
): ParameterDecorator {
  return (
    target: Object,
    propertyKey: string | symbol | undefined,
    parameterIndex: number,
  ) => {
    if (propertyKey === undefined) throw new Error('invalid property key');

    const descriptor = Object.getOwnPropertyDescriptor(target, propertyKey);
    const originalMethod = descriptor?.value as Fn;
    if (typeof originalMethod !== 'function') {
      throw new Error('property descriptor value must be a method');
    }

    const wrappedMethod = function (this: unknown, ...args: unknown[]) {
      const param = args[parameterIndex];
      args[parameterIndex] =
        mode === 'pipe' ? decorator(param) : (decorator(param), param);
      return originalMethod.apply(this, args);
    };

    Object.defineProperty(target, propertyKey, {
      ...descriptor,
      value: wrappedMethod,
    });
  };
}
