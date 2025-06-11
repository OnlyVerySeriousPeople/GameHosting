using AuthService.Dotnet.Infrastructure.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace AuthService.Dotnet.Persistence.Data
{
	public class AuthDbContext(DbContextOptions<AuthDbContext> opt)
		: IdentityDbContext<UserIdentity>(opt)
	{
	}
}
