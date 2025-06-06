using AuthService.Dotnet.Domain.Entities;

namespace AuthService.Dotnet.Application.Contracts
{
	public interface IGoogleAuthHelperService
	{
		Task<GoogleTokens> RetrieveGoogleTokens(string code, CancellationToken cancellationToken);
		Task<GoogleTokens> RefreshGoogleTokens(string refreshToken, CancellationToken cancellationToken);
		Dictionary<string, string?> PrepareGoogleAuthLinkContent();
		Task<GoogleUserInfo> GetGoogleUserInfo(string token, CancellationToken cancellationToken);
	}
}
