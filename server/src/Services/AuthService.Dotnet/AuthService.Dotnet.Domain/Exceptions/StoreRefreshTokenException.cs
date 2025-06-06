namespace AuthService.Dotnet.Domain.Exceptions
{
	public class StoreRefreshTokenException(string userId)
		: Exception($"Failed to store refresh token. UserId {userId}");
}
