## Implemented GoF Patterns

### Chain of Responsibility

The `RpcExceptionFilter` implements the Chain of Responsibility pattern to handle different types of exceptions in a sequential manner. Each handler in the chain is responsible for a specific exception type and can either process it or pass it to the next handler.

**Sources**:
- [`rpc-exception.filter.ts`](https://github.com/OnlyVerySeriousPeople/GameHosting/blob/main/server/src/Services/PlayerService.Nodejs/src/common/filters/rpc-exception.filter.ts)
- [`handlers/abstract-handler.ts`](https://github.com/OnlyVerySeriousPeople/GameHosting/blob/main/server/src/Services/PlayerService.Nodejs/src/common/filters/handlers/abstract-handler.ts)
- [`handlers/domain-exception.handler.ts`](https://github.com/OnlyVerySeriousPeople/GameHosting/blob/main/server/src/Services/PlayerService.Nodejs/src/common/filters/handlers/domain-exception.handler.ts)
- [`handlers/prisma-exception.handler.ts`](https://github.com/OnlyVerySeriousPeople/GameHosting/blob/main/server/src/Services/PlayerService.Nodejs/src/common/filters/handlers/prisma-exception.handler.ts)
- [`handlers/default-exception.handler.ts`](https://github.com/OnlyVerySeriousPeople/GameHosting/blob/main/server/src/Services/PlayerService.Nodejs/src/common/filters/handlers/default-exception.handler.ts)

### Factory Method

The `ExceptionCreator` abstract class defines a factory method (`createException`) for instantiating different types of domain exceptions.

**Sources**:
- [`exception-creator.ts`](https://github.com/OnlyVerySeriousPeople/GameHosting/blob/main/server/src/Services/PlayerService.Nodejs/src/common/exceptions/factories/exception-creator.ts)
- [`not-found.error.ts`](https://github.com/OnlyVerySeriousPeople/GameHosting/blob/main/server/src/Services/PlayerService.Nodejs/src/common/exceptions/factories/not-found-ex-creator.ts)
- [`invalid-argument.error.ts`](https://github.com/OnlyVerySeriousPeople/GameHosting/blob/main/server/src/Services/PlayerService.Nodejs/src/common/exceptions/factories/invalid-argument-ex-creator.ts)

### Facade

The `ThrowIf` utility class acts as a Facade that simplifies access to the underlying domain-specific exception creation logic.

**Source**: [`throw-if.util.ts`](https://github.com/OnlyVerySeriousPeople/GameHosting/blob/main/server/src/Services/PlayerService.Nodejs/src/common/utils/throw-if.util.ts)

### Decorator

The GrpcValidate function is an implementation of the Decorator Pattern, using TypeScript’s method decorator syntax. It enhances the behavior of gRPC service handler methods by injecting validation logic transparently, without modifying the method's core implementation.

**Source**: [`grpc-validate.decorator.ts`](https://github.com/OnlyVerySeriousPeople/GameHosting/blob/main/server/src/Services/PlayerService.Nodejs/src/common/decorators/grpc-validate.decorator.ts)