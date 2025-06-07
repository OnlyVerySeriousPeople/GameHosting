using AuthService.Dotnet.Application.Contracts;
using AuthService.Dotnet.Domain.Constants;
using AuthService.Dotnet.Domain.Entities;
using AuthService.Dotnet.Domain.Exceptions;

namespace AuthService.Dotnet.Infrastructure.Strategies.AuthenticationStrategies
{
	public class CredentialsAuthenticationStrategy(IAuthHelperService authHelperService)
		: IAuthenticationStrategy
	{
		public string ProviderName => AuthServiceConstants.CredentialsProviderName;

		public async Task<Result<AuthenticationResultValue>> AuthenticateAsync(Dictionary<string, string?> credentials,
			CancellationToken cancellationToken)
		{
			var email = credentials["email"];
			if (string.IsNullOrEmpty(email))
				return Result<AuthenticationResultValue>.Failure(OperationErrors.MissingValue("email"));

			var password = credentials["password"];
			if (string.IsNullOrEmpty(password))
				return Result<AuthenticationResultValue>.Failure(OperationErrors.MissingValue("password"));

			var validationResult = await authHelperService.ValidateCredentialsAsync(email, password);
			if (!validationResult.IsSuccess)
				return Result<AuthenticationResultValue>.Failure(validationResult.Error!);

			var user = validationResult.Value!;

			var result = await authHelperService.PrepareAuthenticationResultValueAsync(
				user, AuthServiceConstants.CredentialsPrefix, cancellationToken);

			if (!result.IsSuccess)
				return Result<AuthenticationResultValue>.Failure(result.Error!);

			var resultValue = result.Value!;

			return Result<AuthenticationResultValue>.Success(resultValue);
		}
	}
}