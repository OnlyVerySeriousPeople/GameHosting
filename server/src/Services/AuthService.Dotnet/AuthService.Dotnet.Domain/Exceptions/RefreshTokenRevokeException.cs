namespace AuthService.Dotnet.Domain.Exceptions
{
	public class RefreshTokenRevokeException()
		: Exception("Failed to revoke user refresh tokens.");
}