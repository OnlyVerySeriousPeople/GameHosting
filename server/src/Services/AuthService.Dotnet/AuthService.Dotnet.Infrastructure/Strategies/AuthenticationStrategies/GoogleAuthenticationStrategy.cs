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
		IAuthHelperService authHelperService,
		UserManager<UserIdentity> userManager)
		: IAuthenticationStrategy
	{
		public string ProviderName => AuthServiceConstants.GoogleProviderName;

		public async Task<Result<AuthenticationResultValue>> AuthenticateAsync(Dictionary<string, string?> credentials,
			CancellationToken cancellationToken)
		{
			var code = credentials["code"];
			if (string.IsNullOrEmpty(code))
				throw new InvalidOperationException("Missing 'code' in credentials for Google authentication.");

			var retrieveGoogleTokensResult = await googleAuthHelper.RetrieveGoogleTokensAsync(code, cancellationToken);

			if (!retrieveGoogleTokensResult.IsSuccess)
				return Result<AuthenticationResultValue>.Failure(retrieveGoogleTokensResult.Error!);
			var googleTokens = retrieveGoogleTokensResult.Value!;

			var getGoogleUserInfoResult =
				await googleAuthHelper.GetGoogleUserInfoAsync(googleTokens.AccessToken, cancellationToken);

			if (!getGoogleUserInfoResult.IsSuccess)
				return Result<AuthenticationResultValue>.Failure(getGoogleUserInfoResult.Error!);
			var googleUserInfo = getGoogleUserInfoResult.Value!;

			var identity = await userManager.FindByEmailAsync(googleUserInfo.Email);

			User? user;

			if (identity is not null)
			{
				user = identity.ToDomain();
			}
			else
			{
				var creationResult = await authHelperService.CreateNewUserAsync(googleUserInfo.Email, null, null, null);
				if (!creationResult.IsSuccess)
					return Result<AuthenticationResultValue>.Failure(creationResult.Error!);

				user = creationResult.Value;
			}

			var result = await authHelperService.PrepareAuthenticationResultValueAsync(
				user!, AuthServiceConstants.GooglePrefix, cancellationToken);

			if (!result.IsSuccess)
				return Result<AuthenticationResultValue>.Failure(result.Error!);

			var resultValue = result.Value!;

			return Result<AuthenticationResultValue>.Success(resultValue);
		}
	}
}