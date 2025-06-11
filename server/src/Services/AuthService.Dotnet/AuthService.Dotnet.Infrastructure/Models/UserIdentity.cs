using Microsoft.AspNetCore.Identity;

namespace AuthService.Dotnet.Infrastructure.Models
{
	public class UserIdentity : IdentityUser
	{
		public string? PlayerId { get; set; } = default!;
		public DateTime CreatedAt { get; set; } = default!;

	}
}
