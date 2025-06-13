type Mode = 'after' | 'pipe' | 'compose' | 'catch';

export const methodDecoratorFactory =
  (decorator: (...args: unknown[]) => unknown, mode?: Mode): MethodDecorator =>
  (_target, _propertyKey, descriptor: PropertyDescriptor) => {
    const original = descriptor.value as Function;
    if (typeof original !== 'function') {
      throw new Error(
        `${methodDecoratorFactory.name} can be applied only to methods`,
      );
    }

    const wrapped = async function (this: unknown, ...args: unknown[]) {
      const callOriginal = (finalArgs: unknown[]) =>
        original.apply(this, finalArgs);

      switch (mode) {
        case 'after': {
          const res = await callOriginal(args);
          await decorator(res, ...args);
          return res;
        }
        case 'pipe': {
          const newArgs = await decorator(...args);
          if (!Array.isArray(newArgs)) {
            throw new Error("decorator must return an array in 'pipe' mode");
          }
          return callOriginal(newArgs);
        }
        case 'compose': {
          const res = await callOriginal(args);
          return decorator(res, ...args);
        }
        case 'catch': {
          try {
            return await callOriginal(args);
          } catch (err) {
            return decorator(err, ...args);
          }
        }
        default: {
          await decorator(...args);
          return callOriginal(args);
        }
      }
    };

    descriptor.value = wrapped;
    return descriptor;
  };
