using AuthService.Dotnet.Application.Common.Models;
using AuthService.Dotnet.Application.Contracts;
using AuthService.Dotnet.Domain.Exceptions;

namespace AuthService.Dotnet.Application.UseCases.RefreshToken
{
	public class RefreshTokenHandler(
		IAuthHelperService authHelperService,
		ITokenService tokenService)
		: ICommandHandler<RefreshTokenCommand, RefreshTokenResult>
	{
		public async Task<RefreshTokenResult> Handle(RefreshTokenCommand command, CancellationToken cancellationToken)
		{
			var prefix = command.Prefix.ToLower();
			var identity = await authHelperService.VerifyRefreshTokenAsync(command.Token, prefix, cancellationToken);

			var (newJwtToken, jwtExpirationDate) = tokenService.GenerateJwtToken(identity);
			var (newRefreshToken, refreshExpirationDate) = tokenService.GenerateRefreshToken();

			await tokenService.RevokeRefreshTokenAsync(command.Token, prefix, cancellationToken);

			var refreshToken = new Domain.Entities.RefreshToken
			{
				Token = newRefreshToken,
				CreatedAt = DateTime.UtcNow,
				Expiration = refreshExpirationDate,
				UserId = identity.Id
			};

			var isTokenStored = await tokenService.StoreRefreshTokenAsync(refreshToken, prefix, cancellationToken);

			if (!isTokenStored)
				throw new RefreshTokenException("Failed to store new refresh token.");

			return new RefreshTokenResult(
				JwtToken: newJwtToken,
				JwtExpiry: jwtExpirationDate,
				RefreshToken: newRefreshToken,
				RefreshExpiry: refreshExpirationDate);
		}
	}
}