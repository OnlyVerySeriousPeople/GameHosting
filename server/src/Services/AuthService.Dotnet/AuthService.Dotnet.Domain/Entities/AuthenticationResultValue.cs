namespace AuthService.Dotnet.Domain.Entities
{
	public class AuthenticationResultValue
	{
		public string JwtToken { get; set; } = null!;
		public DateTime JwtTokenExpiresAt { get; set; } = default!;
		public string RefreshToken { get; set; } = null!;
		public DateTime RefreshTokenExpiresAt { get; set; } = default!;
	}
}
