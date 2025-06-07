using AuthService.Dotnet.Domain.Entities;

namespace AuthService.Dotnet.Application.Contracts
{
	public interface IAuthHelperService
	{
		Task<User> CreateNewUserAsync(string email, string? username, string? playerId, string? password);
		Task<User> ValidateCredentialsAsync(string email, string password);

		Task<AuthenticationResultValue> PrepareAuthenticationResultValueAsync(User user, string prefix,
			CancellationToken cancellationToken);

		Task<User> VerifyRefreshTokenAsync(string token, string prefix, CancellationToken cancellationToken);
		Task RemoveAllUserDataAsync(string userId, CancellationToken cancellationToken);
		Task DropAllUserRefreshTokensAsync(string userId, CancellationToken cancellationToken);
	}
}