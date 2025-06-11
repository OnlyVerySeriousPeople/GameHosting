using AuthService.Dotnet.Application.Common.Models;
using AuthService.Dotnet.Application.Contracts;
using AuthService.Dotnet.Domain.Entities;
using AuthService.Dotnet.Domain.Exceptions;

namespace AuthService.Dotnet.Application.UseCases.RefreshToken
{
	public class RefreshTokenHandler(
		IAuthHelperService authHelperService,
		ITokenService tokenService)
		: ICommandHandler<RefreshTokenCommand, Result<RefreshTokenResult>>
	{
		public async Task<Result<RefreshTokenResult>> Handle(RefreshTokenCommand command,
			CancellationToken cancellationToken)
		{
			var prefix = command.Prefix.ToLower();
			var verifyResult =
				await authHelperService.VerifyRefreshTokenAsync(command.Token, prefix, cancellationToken);

			if (!verifyResult.IsSuccess)
				return Result<RefreshTokenResult>.Failure(verifyResult.Error!);

			var identity = verifyResult.Value!;

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
				return Result<RefreshTokenResult>.Failure(RefreshTokenErrors.StoringFailed());

			var result = new RefreshTokenResult(
				JwtToken: newJwtToken,
				JwtExpiry: jwtExpirationDate,
				RefreshToken: newRefreshToken,
				RefreshExpiry: refreshExpirationDate);

			return Result<RefreshTokenResult>.Success(result);
		}
	}
}