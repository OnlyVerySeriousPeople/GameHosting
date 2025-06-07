using AuthService.Dotnet.Domain.Entities;
using MediatR;

namespace AuthService.Dotnet.Application.Contracts
{
	public interface IAuthHelperService
	{
		Task<Result<User>> CreateNewUserAsync(string email, string? username, string? playerId, string? password);
		Task<Result<User>> ValidateCredentialsAsync(string email, string password);

		Task<Result<AuthenticationResultValue>> PrepareAuthenticationResultValueAsync(User user, string prefix,
			CancellationToken cancellationToken);

		Task<Result<User>> VerifyRefreshTokenAsync(string token, string prefix, CancellationToken cancellationToken);
		Task<Result<Unit>> RemoveAllUserDataAsync(string userId, CancellationToken cancellationToken);
		Task<Result<Unit>> DropAllUserRefreshTokensAsync(string userId, CancellationToken cancellationToken);
	}
}