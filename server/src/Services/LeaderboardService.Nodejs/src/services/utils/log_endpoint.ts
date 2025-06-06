import {logger} from '../../utils/logger';
import {methodDecoratorFactory} from '../../utils/method_decorator_factory';

export const LogEndpoint = (endpointName?: string) =>
  methodDecoratorFactory((...args: unknown[]) => {
    if (process.env.NODE_ENV !== 'development') return;

    const [res, req] = args;
    const message = endpointName
      ? `${endpointName}(${req}) -> ${res}`
      : `${req} -> ${res}`;
    logger.debug(message);
  }, 'after');
