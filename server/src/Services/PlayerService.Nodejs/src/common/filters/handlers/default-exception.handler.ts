import { AbstractExceptionHandler } from './abstract-handler';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { throwError } from 'rxjs';
import { UNKNOWN_ERROR } from '@error-messages/db-error-messages.constants';

export class DefaultExceptionHandler extends AbstractExceptionHandler {
  protected canHandle(): boolean {
    return true;
  }

  protected process() {
    return throwError(
      () =>
        new RpcException({
          message: UNKNOWN_ERROR,
          code: status.UNKNOWN,
        }),
    );
  }
}
