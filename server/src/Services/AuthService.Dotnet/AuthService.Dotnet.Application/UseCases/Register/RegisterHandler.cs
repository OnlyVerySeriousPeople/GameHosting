using AuthService.Dotnet.Application.Common.Models;
using AuthService.Dotnet.Application.Contracts;
using AuthService.Dotnet.Domain.Constants;
using AuthService.Dotnet.Domain.Entities;
using AuthService.Dotnet.Domain.Exceptions;

namespace AuthService.Dotnet.Application.UseCases.Register
{
	public class RegisterHandler(
		IAuthHelperService authHelperService,
		ITokenService tokenService)
		: ICommandHandler<RegisterCommand, Result<RegisterResult>>
	{
		public async Task<Result<RegisterResult>> Handle(RegisterCommand command, CancellationToken cancellationToken)
		{
			var result = await authHelperService.CreateNewUserAsync(
				command.Email, command.Username, command.PlayerId, command.Password);

			if (!result.IsSuccess)
				return Result<RegisterResult>.Failure(result.Error!);

			var newUser = result.Value!;

			var (jwtToken, jwtExpirationDate) = tokenService.GenerateJwtToken(newUser);
			var (refreshToken, refreshExpirationDate) = tokenService.GenerateRefreshToken();

			var refreshTokenEntity = new Domain.Entities.RefreshToken
			{
				Token = refreshToken,
				CreatedAt = DateTime.UtcNow,
				Expiration = refreshExpirationDate,
				UserId = newUser.Id
			};

			var isTokenStored = await tokenService.StoreRefreshTokenAsync(refreshTokenEntity,
				AuthServiceConstants.CredentialsPrefix, cancellationToken);

			if (!isTokenStored)
				return Result<RegisterResult>.Failure(RefreshTokenErrors.StoringFailed());

			var registerResult = new RegisterResult(
				JwtToken: jwtToken,
				JwtExpiry: jwtExpirationDate,
				RefreshToken: refreshToken,
				RefreshExpiry: refreshExpirationDate);

			return Result<RegisterResult>.Success(registerResult);
		}
	}
}