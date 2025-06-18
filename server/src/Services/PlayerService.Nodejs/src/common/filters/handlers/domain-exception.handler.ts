import { AbstractExceptionHandler } from './abstract-handler';
import { DomainException } from '../../exceptions/domain-exception';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { DomainNotFoundError } from '../../exceptions/not-found.error';
import { DomainInvalidArgumentError } from '../../exceptions/invalid-argument.error';
import { throwError } from 'rxjs';
import { UNKNOWN_ERROR } from '@error-messages/db-error-messages.constants';

export class DomainExceptionHandler extends AbstractExceptionHandler {
  private domainErrorRpcCodeMap = new Map([
    [DomainNotFoundError, status.NOT_FOUND],
    [DomainInvalidArgumentError, status.INVALID_ARGUMENT],
  ]);

  protected canHandle(exception: Error): boolean {
    return exception instanceof DomainException;
  }

  protected process(exception: DomainException) {
    for (const [ErrorClass, grpcCode] of this.domainErrorRpcCodeMap.entries()) {
      if (exception instanceof ErrorClass) {
        return throwError(
          () =>
            new RpcException({ message: exception.message, code: grpcCode }),
        );
      }
    }
    return throwError(
      () => new RpcException({ message: UNKNOWN_ERROR, code: status.UNKNOWN }),
    );
  }
}
