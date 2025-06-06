using AuthService.Dotnet.Application.Contracts;
using AuthService.Dotnet.Domain.Constants;
using AuthService.Dotnet.Domain.Entities;
using AuthService.Dotnet.Infrastructure.Common.Mappings;
using AuthService.Dotnet.Infrastructure.Models;
using Microsoft.AspNetCore.Identity;

namespace AuthService.Dotnet.Infrastructure.Strategies.AuthenticationStrategies
{
	public class GoogleAuthenticationStrategy(
		IGoogleAuthHelperService googleAuthHelper,
		IAuthHelper authHelper,
		UserManager<UserIdentity> userManager)
		: IAuthenticationStrategy
	{
		public string ProviderName => AuthServiceConstants.GoogleProviderName;

		public async Task<AuthenticationResult> AuthenticateAsync(Dictionary<string, string?> credentials,
			CancellationToken cancellationToken)
		{
			try
			{
				var code = credentials["code"];
				if (string.IsNullOrEmpty(code))
					throw new InvalidOperationException("Missing 'code' in credentials for Google authentication.");

				var googleTokens = await googleAuthHelper.RetrieveGoogleTokens(code, cancellationToken);

				var googleUserInfo =
					await googleAuthHelper.GetGoogleUserInfo(googleTokens.AccessToken, cancellationToken);

				var identity = await userManager.FindByEmailAsync(googleUserInfo.Email);
				User? user;

				if (identity is not null) user = identity.ToDomain();
				else user = await authHelper.CreateNewUserAsync(googleUserInfo.Email, null, null, null);

				var resultValue = await authHelper.PrepareAuthenticationResultValue(
					user, AuthServiceConstants.GooglePrefix, cancellationToken);

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