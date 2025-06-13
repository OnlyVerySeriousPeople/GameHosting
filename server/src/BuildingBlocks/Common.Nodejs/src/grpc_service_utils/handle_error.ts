import {Code, ConnectError} from '@connectrpc/connect';
import {DatabaseError, InternalError, RequestError} from '../errors';
import {logger, methodDecoratorFactory} from '../utils';

export const HandleError = (desc?: string) =>
  methodDecoratorFactory((err: unknown) => {
    logger.error(err);

    const formatMsg = (msg: string) => (desc ? `${desc} (${msg})` : msg);

    if (err instanceof RequestError) {
      throw new ConnectError(formatMsg(err.message), Code.InvalidArgument);
    }

    if (err instanceof DatabaseError || err instanceof InternalError) {
      throw new ConnectError(formatMsg(err.message), Code.Internal);
    }

    if (err instanceof Error) {
      throw new ConnectError('unexpected internal error', Code.Unknown);
    }

    throw new ConnectError('something went wrong', Code.Unknown);
  }, 'catch');
