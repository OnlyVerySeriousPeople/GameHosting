namespace AuthService.Dotnet.Domain.Exceptions
{
	public class UserNotFoundException(string userId)
		: Exception($"User with id {userId} not found.");
}