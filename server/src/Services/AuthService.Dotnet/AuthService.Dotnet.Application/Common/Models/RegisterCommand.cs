using AuthService.Dotnet.Application.Contracts;

namespace AuthService.Dotnet.Application.Common.Models
{
	public record RegisterCommand(string Username, string Password, string Email, string PlayerId)
		: ICommand<RegisterResult>;
}