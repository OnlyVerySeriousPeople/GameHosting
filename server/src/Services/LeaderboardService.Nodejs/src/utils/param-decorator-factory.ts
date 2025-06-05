export function paramDecoratorFactory(
  decorator: (arg: unknown) => unknown,
  pipe: boolean,
): ParameterDecorator {
  return (
    target: Object,
    propertyKey: string | symbol | undefined,
    parameterIndex: number,
  ) => {
    if (propertyKey === undefined) {
      throw new Error('Unexpected decorator error.');
    }

    const descriptor = Object.getOwnPropertyDescriptor(target, propertyKey);
    const originalMethod = descriptor?.value;

    const wrappedMethod = function (this: unknown, ...args: unknown[]) {
      const param = args[parameterIndex];
      args[parameterIndex] = pipe
        ? decorator(param)
        : (decorator(param), param);
      return originalMethod.apply(this, args);
    };

    Object.defineProperty(target, propertyKey, {
      ...descriptor,
      value: wrappedMethod,
    });
  };
}
