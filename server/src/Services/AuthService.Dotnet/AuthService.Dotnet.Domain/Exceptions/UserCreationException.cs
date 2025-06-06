namespace AuthService.Dotnet.Domain.Exceptions
{
	public class UserCreationException(string email, string? details = null) : Exception(
		$"Failed to create user with email: {email}.{Environment.NewLine}{details}");
}