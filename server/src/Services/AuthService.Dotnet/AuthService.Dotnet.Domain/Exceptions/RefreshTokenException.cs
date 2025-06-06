namespace AuthService.Dotnet.Domain.Exceptions
{
	public class RefreshTokenException(string message)
		: Exception($"Token refresh failed.{Environment.NewLine}{message}");
}
