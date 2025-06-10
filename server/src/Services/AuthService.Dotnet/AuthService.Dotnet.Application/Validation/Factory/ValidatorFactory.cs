using AuthService.Dotnet.Application.Common.Models;
using AuthService.Dotnet.Application.Contracts;
using AuthService.Dotnet.Application.UseCases.DropUserRefreshTokens;
using AuthService.Dotnet.Application.UseCases.Login;
using AuthService.Dotnet.Application.UseCases.RefreshToken;
using AuthService.Dotnet.Application.UseCases.Register;
using AuthService.Dotnet.Application.UseCases.RemoveUser;
using AuthService.Dotnet.Domain.Entities;
using AuthService.Dotnet.Domain.Exceptions;

namespace AuthService.Dotnet.Application.Validation.Factory
{
	public class ValidatorFactory(IServiceProvider serviceProvider) 
		: IValidationFactory
	{
		private readonly Dictionary<Type, Type> _validators = new()
		{
			{ typeof(DropUserRefreshTokensCommand), typeof(DropUserRefreshTokensValidator) },
			{ typeof(LoginCommand), typeof(LoginValidator) },
			{ typeof(RefreshTokenCommand), typeof(RefreshTokenValidator) },
			{ typeof(RegisterCommand), typeof(RegisterValidator) },
			{ typeof(RemoveUserCommand), typeof(RemoveUserValidator) },
		};

		public Result<IValidator<T>> GetValidator<T>(Type requestType)
		{
			if (!_validators.TryGetValue(requestType, out var validatorType))
				return Result<IValidator<T>>.Failure(
					OperationErrors.NotSupported("Validator", requestType.ToString()));

			var service = serviceProvider.GetService(validatorType);
			if (service is not IValidator<T> validator)
				return Result<IValidator<T>>.Failure(
					OperationErrors.ImplementationNotRegistered(
						validatorType.Name, "IValidator<T>"));


			return Result<IValidator<T>>.Success(validator);
		}
	}
}