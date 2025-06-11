using AuthService.Dotnet.Application.Contracts;
using AuthService.Dotnet.Domain.Entities;
using MediatR;

namespace AuthService.Dotnet.Application.Common.Models
{
	public record DropUserRefreshTokensCommand(string UserId)
		: ICommand<Result<Unit>>;
}