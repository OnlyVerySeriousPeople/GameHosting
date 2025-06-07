namespace AuthService.Dotnet.Domain.Exceptions
{
	public class UserDeletionException(string userId, string? details = "")
		: Exception($"Failed to delete user with Id: {userId}.{Environment.NewLine}{details}");
}