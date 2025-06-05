import {Fn} from './types';

export function methodDecoratorFactory(
  decorator: Fn,
  mode?: 'after' | 'pipe' | 'compose' | 'catch',
): MethodDecorator {
  return (_target, _propertyKey, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value as Fn;
    if (typeof originalMethod !== 'function') {
      throw new Error(
        `${methodDecoratorFactory.name} can be applied only to methods`,
      );
    }

    const wrappedMethod = async function (this: unknown, ...args: unknown[]) {
      const callOriginal = (finalArgs: unknown[]) =>
        originalMethod.apply(this, finalArgs);

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

    descriptor.value = wrappedMethod;
    return descriptor;
  };
}
