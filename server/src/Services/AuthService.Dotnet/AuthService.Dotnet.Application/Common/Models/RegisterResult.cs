namespace AuthService.Dotnet.Application.Common.Models
{
	public record RegisterResult(
		string JwtToken,
		DateTime JwtExpiry,
		string RefreshToken,
		DateTime RefreshExpiry);
}