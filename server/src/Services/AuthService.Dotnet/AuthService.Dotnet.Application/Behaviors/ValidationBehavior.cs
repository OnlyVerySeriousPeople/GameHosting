using AuthService.Dotnet.Application.Contracts;
using AuthService.Dotnet.Domain.Entities;
using MediatR;

namespace AuthService.Dotnet.Application.Behaviors
{
	internal class ValidationBehavior<TRequest, TResponse>(IValidationFactory validationFactory)
		: IPipelineBehavior<TRequest, TResponse>
		where TRequest : notnull
		where TResponse : class
	{
		public Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next,
			CancellationToken cancellationToken)
		{
			var getValidatorResult = validationFactory.GetValidator<TRequest>(typeof(TRequest));

			if (!getValidatorResult.IsSuccess)
			{
				var error = getValidatorResult.Error;
				var failure = CreateFailureResponse(error!);
				return Task.FromResult(failure);
			}

			var validator = getValidatorResult.Value!;
			var validationResult = validator.Validate(request);

			if (!validationResult.IsSuccess)
			{
				var error = validationResult.Error;
				var failure = CreateFailureResponse(error!);
				return Task.FromResult(failure);
			}

			return next();
		}

		private TResponse CreateFailureResponse(Error error)
		{
			var resultGenericType = typeof(TResponse).GetGenericArguments().First();
			var failureFactory = typeof(Result<>)
				.MakeGenericType(resultGenericType)
				.GetMethod(nameof(Result<object>.Failure))!;

			var failureResult = failureFactory.Invoke(null, [error])!;
			return (TResponse)failureResult;
		}
	}
}