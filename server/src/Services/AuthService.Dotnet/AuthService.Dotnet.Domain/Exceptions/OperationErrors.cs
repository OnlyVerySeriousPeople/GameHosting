using AuthService.Dotnet.Domain.Entities;

namespace AuthService.Dotnet.Domain.Exceptions
{
	public static class OperationErrors
	{
		public static Error MissingValue(string valueName) => new("OperationErrors.MissingValue",
			$"Missing '{valueName}' in credentials for authentication.", 400);

		public static Error ParsingFailed(string valueName) => new("OperationErrors.ParsingFailed",
			$"Failed to parse {valueName}.", 500);

		public static Error ImplementationNotRegistered(string implementationName, string interfaceName) => new(
			"OperationErrors.TypeNotRegistered",
			$"Type '{implementationName}' is not registered in DI as {interfaceName}.",
			400);

		public static Error NotSupported(string featureName, string featureSubject) => new(
			"OperationErrors.NotSupported",
			$"{featureName} '{featureSubject}' is not supported.", 400);
	}
}