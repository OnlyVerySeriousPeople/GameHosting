namespace AuthService.Dotnet.Domain.Options
{
	public record GoogleAuthOptions
	{
		public string ClientId { get; set; } = default!;
		public string ClientSecret { get; set; } = default!;
		public string AuthEndpoint { get; set; } = default!;
		public string UserInfoEndpoint { get; set; } = default!;
		public string TokenEndpoint { get; set; } = default!;
		public string RefreshEndpoint { get; set; } = default!;
	}
}