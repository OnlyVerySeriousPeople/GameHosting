using AuthService.Dotnet.Application.Contracts;
using AuthService.Dotnet.Domain.Constants;
using AuthService.Dotnet.Domain.Entities;

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
				throw new InvalidOperationException("Missing 'email' in credentials for authentication.");
			var password = credentials["password"];
			if (string.IsNullOrEmpty(password))
				throw new InvalidOperationException("Missing 'password' in credentials for authentication.");

			var validationResult = await authHelperService.ValidateCredentialsAsync(email, password);
			if (!validationResult.IsSuccess)
				return Result<AuthenticationResultValue>.Failure(validationResult.Error!);

			var user = validationResult.Value!;

			var resultValue = await authHelperService.PrepareAuthenticationResultValueAsync(
				user, AuthServiceConstants.CredentialsPrefix, cancellationToken);

			return Result<AuthenticationResultValue>.Success(resultValue);
		}
	}
}