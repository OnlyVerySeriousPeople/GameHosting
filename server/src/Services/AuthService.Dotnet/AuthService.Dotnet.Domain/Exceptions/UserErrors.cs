using AuthService.Dotnet.Domain.Entities;

namespace AuthService.Dotnet.Domain.Exceptions
{
	public static class UserErrors
	{
		public static Error AlreadyExist(string email) => new("UserErrors.AlreadyExist",
			$"Failed to create user with email: {email}. User with such email already exists.", 400);

		public static Error NotFound(string identifier) => new("UserErrors.NotFound",
			$"User with id/email {identifier} not found.", 404);

		public static Error DeletionFailed(string userId, string extraDetails = "") => new("UserErrors.DeletionFailed",
			$"Failed to delete user with Id: {userId}.{extraDetails}", 500);

		public static Error CreationFailed(string email, string extraDetails = "") => new("UserErrors.CreationFailed",
			$"Failed to create user with email: {email}.{extraDetails}", 500);

		public static Error InvalidPassword() => new("UserErrors.InvalidPassword",
			"Failed to validate credentials. Invalid Password", 400);
	}
}