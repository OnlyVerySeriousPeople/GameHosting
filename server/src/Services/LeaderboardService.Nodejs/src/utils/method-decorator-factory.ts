export function methodDecoratorFactory(
  decorator: (...args: unknown[]) => unknown,
  mode?: 'pipe' | 'compose' | 'catch',
): MethodDecorator {
  return (_target, _propertyKey, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    const wrappedMethod = function (this: unknown, ...args: unknown[]) {
      switch (mode) {
        case 'pipe': {
          const newArgs = decorator(...args);
          if (!Array.isArray(newArgs)) {
            throw new Error(
              "decorator must return an array when 'pipe' is true",
            );
          }
          return originalMethod.apply(this, newArgs);
        }
        case 'compose': {
          const res = originalMethod.apply(this, args);
          return decorator(res);
        }
        case 'catch': {
          try {
            return originalMethod.apply(this, args);
          } catch (err) {
            return decorator(err, args);
          }
        }
        default: {
          decorator(...args);
          return originalMethod.apply(this, args);
        }
      }
    };

    descriptor.value = wrappedMethod;
    return descriptor;
  };
}
