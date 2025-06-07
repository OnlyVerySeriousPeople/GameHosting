using AuthService.Dotnet.Application.Contracts;
using AuthService.Dotnet.Domain.Constants;
using AuthService.Dotnet.Domain.Entities;

namespace AuthService.Dotnet.Infrastructure.Strategies.AuthenticationStrategies
{
	public class CredentialsAuthenticationStrategy(IAuthHelperService authHelperService)
		: IAuthenticationStrategy
	{
		public string ProviderName => AuthServiceConstants.CredentialsProviderName;

		public async Task<AuthenticationResult> AuthenticateAsync(Dictionary<string, string?> credentials,
			CancellationToken cancellationToken)
		{
			try
			{
				var email = credentials["email"];
				if (string.IsNullOrEmpty(email))
					throw new InvalidOperationException("Missing 'email' in credentials for authentication.");
				var password = credentials["password"];
				if (string.IsNullOrEmpty(password))
					throw new InvalidOperationException("Missing 'password' in credentials for authentication.");

				var user = await authHelperService.ValidateCredentialsAsync(email, password);

				var resultValue = await authHelperService.PrepareAuthenticationResultValueAsync(
					user, AuthServiceConstants.CredentialsPrefix, cancellationToken);

				return new AuthenticationResult
				{
					IsSuccess = true,
					Value = resultValue
				};
			}
			catch (Exception ex)
			{
				return new AuthenticationResult
				{
					IsSuccess = false,
					Error = ex
				};
			}
		}
	}
}