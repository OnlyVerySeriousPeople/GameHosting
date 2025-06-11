using AuthService.Dotnet.Domain.Entities;

namespace AuthService.Dotnet.Domain.Exceptions
{
	public class ValidationsErrors
	{
		public static Error ValidationFailed(string errorMessage) => new(
			"ValidationsErrors.ValidationFailed",
			errorMessage,
			400);

		public static Error IncorrectValidationHandlerUsage(string errorMessage) =>
			new("ValidationsErrors.IncorrectValidationHandlerUsage",
				errorMessage,
				500);
	}
}