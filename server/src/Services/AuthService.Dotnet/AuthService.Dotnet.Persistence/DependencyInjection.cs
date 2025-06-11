using AuthService.Dotnet.Domain.Options;
using AuthService.Dotnet.Persistence.Data;
using AuthService.Dotnet.Persistence.Extensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace AuthService.Dotnet.Persistence
{
	public static class DependencyInjection
	{
		public static void AddAuthPersistence(this IHostApplicationBuilder builder)
		{
			var config = builder.Configuration;

			var connectionString = config.GetConnectionString("Postgres");
			builder.Services.Configure<IdentityCheckOptions>(config.GetSection("Authentication"));

			builder.Services.AddDbContext<AuthDbContext>(opt => { opt.UseNpgsql(connectionString); });

			builder.Services.AddConfiguredIdentity(config);
		}
	}
}