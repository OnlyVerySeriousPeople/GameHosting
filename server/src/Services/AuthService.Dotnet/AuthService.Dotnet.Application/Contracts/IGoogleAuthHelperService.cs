using AuthService.Dotnet.Domain.Entities;

namespace AuthService.Dotnet.Application.Contracts
{
	public interface IGoogleAuthHelperService
	{
		Task<GoogleTokens> RetrieveGoogleTokensAsync(string code, CancellationToken cancellationToken);
		Task<GoogleTokens> RefreshGoogleTokensAsync(string refreshToken, CancellationToken cancellationToken);
		Dictionary<string, string?> PrepareGoogleAuthLinkContent();
		Task<GoogleUserInfo> GetGoogleUserInfoAsync(string token, CancellationToken cancellationToken);
	}
}
