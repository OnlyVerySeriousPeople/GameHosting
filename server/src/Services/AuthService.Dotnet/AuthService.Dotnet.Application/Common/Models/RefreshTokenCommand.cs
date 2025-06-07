using AuthService.Dotnet.Application.Contracts;
using AuthService.Dotnet.Domain.Entities;

namespace AuthService.Dotnet.Application.Common.Models
{
	public record RefreshTokenCommand(string Token, string Prefix) : ICommand<Result<RefreshTokenResult>>;
}