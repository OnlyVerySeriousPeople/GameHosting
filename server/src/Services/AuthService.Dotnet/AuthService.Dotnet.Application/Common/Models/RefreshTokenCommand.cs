using AuthService.Dotnet.Application.Contracts;

namespace AuthService.Dotnet.Application.Common.Models
{
	public record RefreshTokenCommand(string Token, string Prefix) : ICommand<RefreshTokenResult>;
}