import {logger, methodDecoratorFactory} from '../utils';

export const LogEndpoint = (endpointName?: string) =>
  methodDecoratorFactory((...args: unknown[]) => {
    if (process.env.NODE_ENV !== 'development') return;

    const [res, req] = args;
    logger.debug(
      {
        reguest: req,
        response: res,
      },
      endpointName,
    );
  }, 'after');
