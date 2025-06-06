using AuthService.Dotnet.Application.Contracts;
using AuthService.Dotnet.Domain.Constants;
using AuthService.Dotnet.Domain.Entities;
using AuthService.Dotnet.Domain.Exceptions;
using AuthService.Dotnet.Infrastructure.Models;
using Microsoft.AspNetCore.Identity;

namespace AuthService.Dotnet.Infrastructure.Strategies.AuthenticationStrategies
{
	public class CredentialsAuthenticationStrategy(
		IAuthHelper authHelper,
		UserManager<UserIdentity> userManager,
		ITokenService tokenService)
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

				var user = await authHelper.ValidateCredentialsAsync(email, password);

				var (jwtToken, jwtExpirationDate) = tokenService.GenerateJwtToken(user);
				var (refreshToken, refreshExpirationDate) = tokenService.GenerateRefreshToken();

				var refreshTokenEntity = new RefreshToken
				{
					Token = refreshToken,
					CreatedAt = DateTime.UtcNow,
					Expiration = refreshExpirationDate,
					UserId = user.Id
				};

				var isTokenStored = await tokenService.StoreRefreshTokenAsync(refreshTokenEntity,
					AuthServiceConstants.CredentialsPrefix, cancellationToken);

				if (!isTokenStored)
					throw new StoreRefreshTokenException(user.Id);

				return new AuthenticationResult
				{
					IsSuccess = true,
					Value = new AuthenticationResultValue()
					{
						JwtToken = jwtToken,
						JwtTokenExpiresAt = jwtExpirationDate,
						RefreshToken = refreshToken,
						RefreshTokenExpiresAt = refreshExpirationDate
					}
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