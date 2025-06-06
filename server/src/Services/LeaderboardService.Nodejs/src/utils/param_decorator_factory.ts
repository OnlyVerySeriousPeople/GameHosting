export const paramDecoratorFactory =
  (decorator: (arg: unknown) => unknown, mode?: 'pipe'): ParameterDecorator =>
  (
    target: Object,
    propertyKey: string | symbol | undefined,
    parameterIndex: number,
  ) => {
    if (propertyKey === undefined) throw new Error('invalid property key');

    const descriptor = Object.getOwnPropertyDescriptor(target, propertyKey);
    const original = descriptor?.value as Function;
    if (typeof original !== 'function') {
      throw new Error('property descriptor value must be a method');
    }

    const wrapped = function (this: unknown, ...args: unknown[]) {
      const param = args[parameterIndex];
      args[parameterIndex] =
        mode === 'pipe' ? decorator(param) : (decorator(param), param);
      return original.apply(this, args);
    };

    Object.defineProperty(target, propertyKey, {
      ...descriptor,
      value: wrapped,
    });
  };
