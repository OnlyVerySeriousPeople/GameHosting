using AuthService.Dotnet.Application.Contracts;
using AuthService.Dotnet.Domain.Entities;

namespace AuthService.Dotnet.Application.Common.Models
{
	public record LoginCommand(
		string? Email,
		string? Password,
		string? Code,
		string Provider)
		: ICommand<Result<LoginResult>>;
}