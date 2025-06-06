using AuthService.Dotnet.Domain.Options;
using AuthService.Dotnet.Infrastructure.Models;
using AuthService.Dotnet.Persistence.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace AuthService.Dotnet.Persistence.Extensions
{
	public static class ConfiguredIdentity
	{
		public static void AddConfiguredIdentity(this IServiceCollection services,
			IConfiguration config)
		{
			var authOptions = config.GetSection("Authentication").Get<IdentityCheckOptions>()!;

			services.AddIdentity<UserIdentity, IdentityRole>(options =>
			{
				options.Password.RequireDigit = authOptions.RequireDigit;
				options.Password.RequiredLength = authOptions.RequiredLength;
				options.Password.RequireLowercase = authOptions.RequireLowercase;
				options.Password.RequireUppercase = authOptions.RequireUppercase;
				options.Password.RequireNonAlphanumeric = authOptions.RequireNonAlphanumeric;
				options.Password.RequiredUniqueChars = authOptions.RequireUniqueChars;
				options.User.RequireUniqueEmail = authOptions.RequireUniqueEmail;
				options.Lockout.MaxFailedAccessAttempts = authOptions.MaxFailedAccessAttempts;
				options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(authOptions.DefaultLockout);
			}).AddEntityFrameworkStores<AuthDbContext>();
		}
	}
}