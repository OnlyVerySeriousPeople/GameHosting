
using AuthService.Dotnet.Application.Contracts;

namespace AuthService.Dotnet.Application.Common.Models
{
	public record LoginCommand(
		string? Email,
		string? Password,
		string? Code,
		string Provider)
		: ICommand<LoginResult>;
}
