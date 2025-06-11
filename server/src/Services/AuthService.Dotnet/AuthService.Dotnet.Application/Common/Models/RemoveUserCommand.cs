using AuthService.Dotnet.Application.Contracts;
using AuthService.Dotnet.Domain.Entities;
using MediatR;

namespace AuthService.Dotnet.Application.Common.Models
{
	public record RemoveUserCommand(string UserId)
		: ICommand<Result<Unit>>;
}
