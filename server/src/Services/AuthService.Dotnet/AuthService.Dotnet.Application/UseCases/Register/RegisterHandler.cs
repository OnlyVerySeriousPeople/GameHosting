using AuthService.Dotnet.Application.Common.Models;
using AuthService.Dotnet.Application.Contracts;
using AuthService.Dotnet.Domain.Constants;
using AuthService.Dotnet.Domain.Exceptions;

namespace AuthService.Dotnet.Application.UseCases.Register
{
	public class RegisterHandler(
		IAuthHelperService authHelperService,
		ITokenService tokenService)
		: ICommandHandler<RegisterCommand, RegisterResult>
	{
		public async Task<RegisterResult> Handle(RegisterCommand command, CancellationToken cancellationToken)
		{
			var newUser = await authHelperService.CreateNewUserAsync(
				command.Email, command.Username, command.PlayerId, command.Password);

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
				throw new StoreRefreshTokenException(newUser.Id);

			return new RegisterResult(
				JwtToken: jwtToken,
				JwtExpiry: jwtExpirationDate,
				RefreshToken: refreshToken,
				RefreshExpiry: refreshExpirationDate);
		}
	}
}