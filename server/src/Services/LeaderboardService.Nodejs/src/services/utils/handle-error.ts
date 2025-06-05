import {Code, ConnectError} from '@connectrpc/connect';
import {DatabaseError, InternalError, RequestError} from '../../errors';
import {methodDecoratorFactory} from '../../utils/method-decorator-factory';

export const handleError = (desc?: string) =>
  methodDecoratorFactory((err: unknown) => {
    const formatMessage = (msg: string) => (desc ? `${desc} (${msg})` : msg);

    if (err instanceof RequestError) {
      throw new ConnectError(formatMessage(err.message), Code.InvalidArgument);
    }

    if (err instanceof DatabaseError || err instanceof InternalError) {
      throw new ConnectError(formatMessage(err.message), Code.Internal);
    }

    if (err instanceof Error) {
      throw new ConnectError(formatMessage(err.message), Code.Unknown);
    }

    throw new ConnectError('something went wrong', Code.Unknown);
  }, 'catch');
