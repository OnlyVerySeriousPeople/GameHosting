import { RpcException } from '@nestjs/microservices';
import { throwError, Observable } from 'rxjs';
import { status } from '@grpc/grpc-js';
import { UNKNOWN_ERROR } from '@error-messages/db-error-messages.constants';

export abstract class AbstractExceptionHandler {
  private nextHandler: AbstractExceptionHandler;

  public setNext(handler: AbstractExceptionHandler): AbstractExceptionHandler {
    this.nextHandler = handler;
    return handler;
  }

  public handle(exception: Error): Observable<never> {
    if (this.canHandle(exception)) {
      return this.process(exception);
    }

    if (this.nextHandler) {
      return this.nextHandler.handle(exception);
    }

    return throwError(
      () =>
        new RpcException({
          message: UNKNOWN_ERROR,
          code: status.UNKNOWN,
        }),
    );
  }

  protected abstract canHandle(exception: Error): boolean;
  protected abstract process(exception: Error): Observable<never>;
}
