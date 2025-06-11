using AuthService.Dotnet.Domain.Entities;

namespace AuthService.Dotnet.Application.Contracts
{
	public interface ITokenService
	{
		public (string, DateTime) GenerateJwtToken(User user);
		public (string, DateTime) GenerateRefreshToken();

		public Task<bool> StoreRefreshTokenAsync(RefreshToken refreshToken, string prefix,
			CancellationToken cancellationToken = default);

		public Task<RefreshToken?> GetRefreshTokenAsync(string token, string prefix,
			CancellationToken cancellationToken = default);

		public Task<bool> RevokeRefreshTokenAsync(string token, string prefix,
			CancellationToken cancellationToken = default);

		public Task<bool> RevokeAllUserRefreshTokensAsync(string userId, CancellationToken cancellationToken = default);

		public Task<bool> IsRefreshTokenValidAsync(string token, string prefix,
			CancellationToken cancellationToken = default);
	}
}