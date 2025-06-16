import { ValidateDtoPipe } from '../pipes/validate-dto.pipe';
import { ClassConstructor } from 'class-transformer';

export function GrpcValidate<T extends object>(
  dtoClass: ClassConstructor<T>,
): MethodDecorator {
  return (target, propertyKey, descriptor: PropertyDescriptor): void => {
    const originalMethod = descriptor.value as (
      ...args: any[]
    ) => Promise<unknown>;

    const pipe = new ValidateDtoPipe(dtoClass);

    descriptor.value = async function (...args: unknown[]): Promise<unknown> {
      const [requestData, ...rest] = args;
      const validated = await pipe.transform(requestData as T);

      return (await originalMethod.apply(this, [
        validated,
        ...rest,
      ])) as unknown;
    };
  };
}
