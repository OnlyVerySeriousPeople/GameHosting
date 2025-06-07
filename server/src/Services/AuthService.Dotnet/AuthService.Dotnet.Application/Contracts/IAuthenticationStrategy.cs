using AuthService.Dotnet.Domain.Entities;

namespace AuthService.Dotnet.Application.Contracts
{
	public interface IAuthenticationStrategy : IStrategy
	{
		Task<Result<AuthenticationResultValue>> AuthenticateAsync(Dictionary<string, string?> credentials,
			CancellationToken cancellationToken);
	}
}
