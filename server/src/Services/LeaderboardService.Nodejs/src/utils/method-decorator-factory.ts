export function methodDecoratorFactory(
  decorator: (...args: unknown[]) => unknown,
  pipe: boolean,
): MethodDecorator {
  return (_target, _propertyKey, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    const wrappedMethod = function (this: unknown, ...args: unknown[]) {
      if (!pipe) {
        decorator(...args);
        return originalMethod.apply(this, args);
      }

      const newArgs = decorator(...args);
      if (!Array.isArray(newArgs)) {
        throw new Error("Decorator must return an array when 'pipe' is true.");
      }
      return originalMethod.apply(this, newArgs);
    };

    descriptor.value = wrappedMethod;
    return descriptor;
  };
}
