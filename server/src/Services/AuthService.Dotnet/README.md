# Patterns used

### CQRS (Command Query Responsibility Segregation)

The project follows the CQRS principle by separating read and write operations into distinct models:
- `Commands` modify application state and are handled independently from queries.
- `Queries` retrieve data and are optimized for read operations.
  
Using this pattern promotes scalability, simplifies business logic, and enhances maintainability.

### MediatR (Mediator Pattern)
Mediator pattern was used to decouple components and manage communication between API and Application layers, this
pattern is implemented using the [MediatR](https://github.com/jbogard/MediatR) library. Each command or query in code is handled by a dedicated handler.

Using this pattern promotes clean separation of concerns and reduces direct dependencies between services and entrypoints.
This is also helpful for managing logic pipelines, as MediatR provides the ability to add preprocessing and postprocessing
behaviors.

### Factory Method Pattern

The Factory Method pattern is applied to encapsulate object creation logic (extracting from DI container).
Using this pattern solves the problem of creating a specific [authentication strategy](https://github.com/OnlyVerySeriousPeople/GameHosting/blob/main/server/src/Services/AuthService.Dotnet/AuthService.Dotnet.Infrastructure/Factories/AuthenticationStrategyFactory.cs)
or [validator](https://github.com/OnlyVerySeriousPeople/GameHosting/blob/main/server/src/Services/AuthService.Dotnet/AuthService.Dotnet.Application/Validation/Factory/ValidatorFactory.cs) for a particular request.
It`s also promotes loose coupling and supports open/closed principles for adding new types or behaviors.

### Builder Pattern

The Builder pattern is used to [construct validation chains](https://github.com/OnlyVerySeriousPeople/GameHosting/blob/main/server/src/Services/AuthService.Dotnet/AuthService.Dotnet.Application/Validation/Builder/ValidationChainBuilder.cs) for checking specific values. It enhances readability, promotes 
reusability, and helps maintain the immutability of the resulting validation objects.

### Strategy Pattern

The Strategy pattern was used to encapsulate the processing logic for different authentication types (e.g., Google, Facebook,
GitHub). By isolating each authentication mechanism into its own [strategy](https://github.com/OnlyVerySeriousPeople/GameHosting/tree/main/server/src/Services/AuthService.Dotnet/AuthService.Dotnet.Infrastructure/Strategies/AuthenticationStrategies), the system becomes more flexible and extensible,
making it much easier to add support for new authentication providers without modifying existing code.

### Chain of Responsibility

The Chain of Responsibility pattern is utilized for processing a sequence of handlers where each handler performs a validation rule
and can either stop or pass the request to the next handler in the chain.
