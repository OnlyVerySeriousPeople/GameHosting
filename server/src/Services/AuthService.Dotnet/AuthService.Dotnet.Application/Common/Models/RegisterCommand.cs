using AuthService.Dotnet.Application.Contracts;
using AuthService.Dotnet.Domain.Entities;

namespace AuthService.Dotnet.Application.Common.Models
{
	public record RegisterCommand(string Username, string Password, string Email, string PlayerId)
		: ICommand<Result<RegisterResult>>;
}