namespace AuthService.Dotnet.Domain.Options
{
	public class GoogleAuthOptions
	{
		public string ClientId { get; } = default!;
		public string ClientSecret { get; } = default!;
		public string AuthEndpoint { get; } = default!;
		public string UserInfoEndpoint { get; } = default!;
		public string TokenEndpoint { get; } = default!;
		public string RefreshEndpoint { get; } = default!;
	}
}