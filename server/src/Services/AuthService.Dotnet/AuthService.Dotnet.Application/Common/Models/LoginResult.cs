namespace AuthService.Dotnet.Application.Common.Models
{
	public record LoginResult(
		string JwtToken,
		DateTime JwtExpiry,
		string RefreshToken,
		DateTime RefreshExpiry);
}