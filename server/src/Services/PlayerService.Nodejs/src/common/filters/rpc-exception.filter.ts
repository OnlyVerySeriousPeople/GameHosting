import { Catch, ExceptionFilter } from '@nestjs/common';
import { DomainException } from '../exceptions/domain-exception';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { DomainNotFoundError } from '../exceptions/not-found.error';
import { Prisma } from '@prisma/client';
import { DomainInvalidArgumentError } from '../exceptions/invalid-argument.error';

@Catch(Error)
export class RpcExceptionFilter implements ExceptionFilter {
  private domainErrorRpcCodeMap = new Map([
    [DomainNotFoundError, status.NOT_FOUND],
    [DomainInvalidArgumentError, status.INVALID_ARGUMENT],
  ]);

  private prismaErrorRpcCodeMap: { [key: string]: status } = {
    P2002: status.ALREADY_EXISTS,
    P2003: status.FAILED_PRECONDITION,
    P2000: status.INVALID_ARGUMENT,
    P2025: status.NOT_FOUND,
  };

  catch(exception: Error) {
    if (exception instanceof DomainException) {
      throw new RpcException(this.domainErrorToRpc(exception));
    }
    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      throw new RpcException(this.prismaErrorToRpc(exception));
    }
    throw new RpcException({
      message: exception.message,
      code: status.UNKNOWN,
    });
  }

  private domainErrorToRpc(ex: DomainException) {
    for (const [ErrorClass, grpcCode] of this.domainErrorRpcCodeMap.entries()) {
      if (ex instanceof ErrorClass) {
        return { message: ex.message, code: grpcCode };
      }
    }
    return { message: ex.message, code: status.UNKNOWN };
  }

  private prismaErrorToRpc(ex: Prisma.PrismaClientKnownRequestError) {
    return {
      message: ex.message,
      code: this.prismaErrorRpcCodeMap[ex.code] ?? status.INTERNAL,
    };
  }
}
