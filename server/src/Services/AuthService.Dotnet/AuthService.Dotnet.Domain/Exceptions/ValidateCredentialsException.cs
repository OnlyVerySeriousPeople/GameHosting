namespace AuthService.Dotnet.Domain.Exceptions
{
	public class ValidateCredentialsException(string details)
		: Exception($"Failed to validate credentials. {details}");
}