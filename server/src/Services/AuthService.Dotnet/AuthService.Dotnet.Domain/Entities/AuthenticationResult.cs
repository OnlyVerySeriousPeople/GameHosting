
namespace AuthService.Dotnet.Domain.Entities
{
	public class AuthenticationResult
	{
		public bool IsSuccess { get; set; } = false;
		public AuthenticationResultValue? Value { get; set; } = null;
		public Exception? Error { get; set; } = null;
	}
}
