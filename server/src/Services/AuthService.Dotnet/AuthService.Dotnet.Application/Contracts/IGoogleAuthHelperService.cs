using AuthService.Dotnet.Domain.Entities;

namespace AuthService.Dotnet.Application.Contracts
{
	public interface IGoogleAuthHelperService
	{
		Task<Result<GoogleTokens>> RetrieveGoogleTokensAsync(string code, CancellationToken cancellationToken);
		Task<Result<GoogleTokens>> RefreshGoogleTokensAsync(string refreshToken, CancellationToken cancellationToken);
		Dictionary<string, string?> PrepareGoogleAuthLinkContent();
		Task<Result<GoogleUserInfo>> GetGoogleUserInfoAsync(string token, CancellationToken cancellationToken);
	}
}
