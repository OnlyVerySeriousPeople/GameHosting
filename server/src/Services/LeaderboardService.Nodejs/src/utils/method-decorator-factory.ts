export function methodDecoratorFactory(
  decorator: (...args: unknown[]) => unknown,
  pipe = false,
): MethodDecorator {
  return (_target, _propertyKey, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: unknown[]) {
      return originalMethod.apply(
        this,
        pipe ? decorator(...args) : (decorator(...args), args),
      );
    };

    return descriptor;
  };
}
