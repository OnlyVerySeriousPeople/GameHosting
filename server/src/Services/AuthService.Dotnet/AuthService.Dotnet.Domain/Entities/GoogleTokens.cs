using Newtonsoft.Json;

namespace AuthService.Dotnet.Domain.Entities
{
	internal class GoogleTokens
	{
		[JsonProperty("access_token")] public string AccessToken { get; set; } = string.Empty;
		[JsonProperty("expires_in")] public long ExpiresIn { get; set; }
		[JsonProperty("refresh_token")] public string RefreshToken { get; set; } = string.Empty;
		[JsonProperty("refresh_token_expires_in")] public long RefreshExpiresIn { get; set; }
		[JsonProperty("scope")] public string Scope { get; set; } = string.Empty;
		[JsonProperty("token_type")] public string TokenType { get; set; } = string.Empty;
	}
}