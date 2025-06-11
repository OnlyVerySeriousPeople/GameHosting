using AuthService.Dotnet.Domain.Entities;

namespace AuthService.Dotnet.Domain.Exceptions
{
	public static class RefreshTokenErrors
	{
		public static Error StoringFailed() => new("RefreshTokenErrors.StoringFailed",
			"Failed to store new refresh token.", 401);

		public static Error InvalidOrExpired() => new Error("RefreshTokenErrors.InvalidOrExpired",
			"Token refresh failed. Invalid or expired refresh token.", 401);

		public static Error UserNotFound() => new Error("RefreshTokenErrors.UserNotFound",
			$"User associated with the refresh token not found.", 401);

		public static Error RevokeFailed() =>
			new Error("RefreshTokenErrors.RevokeFailed", "Failed to revoke user refresh tokens.", 401);
	}
}