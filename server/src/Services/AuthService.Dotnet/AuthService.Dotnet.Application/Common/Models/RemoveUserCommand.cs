using AuthService.Dotnet.Application.Contracts;
using MediatR;

namespace AuthService.Dotnet.Application.Common.Models
{
	public record RemoveUserCommand(string UserId)
		: ICommand<Unit>;
}
