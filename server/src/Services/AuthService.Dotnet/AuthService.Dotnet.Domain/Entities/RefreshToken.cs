namespace AuthService.Dotnet.Domain.Entities
{
	public class RefreshToken
	{
		public string Token { get; set; } = string.Empty;
		public DateTime CreatedAt { get; set; } = default!;
		public DateTime Expiration { get; set; } = default!;
		public string UserId { get; set; } = string.Empty;
	}
}
