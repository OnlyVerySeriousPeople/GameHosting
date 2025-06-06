using System.Net;

namespace AuthService.Dotnet.Exceptions
{
	public class HttpRequestToGoogleException(HttpStatusCode statusCode, string content)
		: HttpRequestException($"Failed to get google services request. StatusCode: {statusCode}, Content: {content}");
}