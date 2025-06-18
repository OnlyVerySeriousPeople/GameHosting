import { AbstractExceptionHandler } from './abstract-handler';
import { Prisma } from '@prisma/client';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { throwError } from 'rxjs';
import {
  ALREADY_EXISTS,
  FAILED_PRECONDITION,
  INTERNAL,
  INVALID_INPUT,
  NOT_FOUND,
} from '@error-messages/db-error-messages.constants';

export class PrismaExceptionHandler extends AbstractExceptionHandler {
  private prismaErrorToResponse: Record<
    string,
    { message: string; code: status }
  > = {
    P2002: {
      message: ALREADY_EXISTS,
      code: status.ALREADY_EXISTS,
    },
    P2003: {
      message: FAILED_PRECONDITION,
      code: status.FAILED_PRECONDITION,
    },
    P2000: {
      message: INVALID_INPUT,
      code: status.INVALID_ARGUMENT,
    },
    P2025: {
      message: NOT_FOUND,
      code: status.NOT_FOUND,
    },
  };

  protected canHandle(exception: Error): boolean {
    return exception instanceof Prisma.PrismaClientKnownRequestError;
  }

  protected process(exception: Prisma.PrismaClientKnownRequestError) {
    const internalErr = { message: INTERNAL, code: status.INTERNAL };
    const response = this.prismaErrorToResponse[exception.code] ?? internalErr;
    return throwError(() => new RpcException(response));
  }
}
