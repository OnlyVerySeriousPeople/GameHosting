using AuthService.Dotnet.Domain.Entities;

namespace AuthService.Dotnet.Application.Contracts
{
	public interface IAuthenticationStrategy : IStrategy
	{
		Task<AuthenticationResult> AuthenticateAsync(Dictionary<string, string?> credentials,
			CancellationToken cancellationToken);
	}
}
