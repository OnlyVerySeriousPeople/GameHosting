using AuthService.Dotnet.Application.Common.Models;
using AuthService.Dotnet.Application.Contracts;

namespace AuthService.Dotnet.Application.UseCases.Login
{
	public class LoginHandler(IStrategyFactory<IAuthenticationStrategy> strategyFactory)
		: ICommandHandler<LoginCommand, LoginResult>
	{
		public async Task<LoginResult> Handle(LoginCommand command, CancellationToken cancellationToken)
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
				throw result.Error!;

			return new LoginResult(
				JwtToken: result.Value!.JwtToken,
				JwtExpiry: result.Value!.JwtTokenExpiresAt,
				RefreshToken: result.Value!.RefreshToken,
				RefreshExpiry: result.Value!.RefreshTokenExpiresAt);
		}
	}
}
