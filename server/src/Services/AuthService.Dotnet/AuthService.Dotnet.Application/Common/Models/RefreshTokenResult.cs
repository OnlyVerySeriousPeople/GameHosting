namespace AuthService.Dotnet.Application.Common.Models
{
	public record RefreshTokenResult(
		string JwtToken,
		DateTime JwtExpiry,
		string RefreshToken,
		DateTime RefreshExpiry);
}