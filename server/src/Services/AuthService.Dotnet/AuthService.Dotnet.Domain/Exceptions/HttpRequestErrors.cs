using AuthService.Dotnet.Domain.Entities;
using System.Net;

namespace AuthService.Dotnet.Domain.Exceptions
{
	public static class HttpRequestErrors
	{
		public static Error SendingFailed(HttpStatusCode statusCode, string extraDescription) => new(
			"HttpRequestErrors.SendingFailed",
			$"Failed to send the request. Response status code {statusCode}.{extraDescription}",
			500);
	}
}