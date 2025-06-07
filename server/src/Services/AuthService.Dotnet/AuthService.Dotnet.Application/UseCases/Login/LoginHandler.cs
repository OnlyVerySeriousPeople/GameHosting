using AuthService.Dotnet.Application.Common.Models;
using AuthService.Dotnet.Application.Contracts;
using AuthService.Dotnet.Domain.Entities;

namespace AuthService.Dotnet.Application.UseCases.Login
{
	public class LoginHandler(IStrategyFactory<IAuthenticationStrategy> strategyFactory)
		: ICommandHandler<LoginCommand, Result<LoginResult>>
	{
		public async Task<Result<LoginResult>> Handle(LoginCommand command, CancellationToken cancellationToken)
		{
			var strategy = strategyFactory.GetStrategy(command.Provider);
			var credentials = new Dictionary<string, string?>
			{
				{ "email", command.Email },
				{ "password", command.Password },
				{ "code", command.Code }
			};
			var result = await strategy.AuthenticateAsync(credentials, cancellationToken);

			if (!result.IsSuccess)
				return Result<LoginResult>.Failure(result.Error!);

			var loginResult = new LoginResult(
				JwtToken: result.Value!.JwtToken,
				JwtExpiry: result.Value!.JwtTokenExpiresAt,
				RefreshToken: result.Value!.RefreshToken,
				RefreshExpiry: result.Value!.RefreshTokenExpiresAt);

			return Result<LoginResult>.Success(loginResult);
		}
	}
}