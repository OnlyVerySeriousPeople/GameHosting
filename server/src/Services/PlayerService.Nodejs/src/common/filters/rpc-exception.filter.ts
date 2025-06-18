import { Catch, ExceptionFilter } from '@nestjs/common';
import { DomainExceptionHandler } from './handlers/domain-exception.handler';
import { PrismaExceptionHandler } from './handlers/prisma-exception.handler';
import { DefaultExceptionHandler } from './handlers/default-exception.handler';
import { AbstractExceptionHandler } from './handlers/abstract-handler';

@Catch(Error)
export class RpcExceptionFilter implements ExceptionFilter {
  private handlerChain: AbstractExceptionHandler;

  constructor() {
    const domainHandler = new DomainExceptionHandler();
    const prismaHandler = new PrismaExceptionHandler();
    const defaultHandler = new DefaultExceptionHandler();

    domainHandler.setNext(prismaHandler).setNext(defaultHandler);

    this.handlerChain = domainHandler;
  }

  catch(exception: Error) {
    return this.handlerChain.handle(exception);
  }
}
