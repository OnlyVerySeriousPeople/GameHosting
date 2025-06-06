using AuthService.Dotnet.Domain.Entities;

namespace AuthService.Dotnet.Application.Contracts
{
	public interface IAuthHelper
	{
		Task<User> CreateNewUserAsync(string email, string? username, string? playerId, string? password);
		Task<User> ValidateCredentialsAsync(string email, string password);
	}
}