using AuthService.Dotnet.Persistence.Data;
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
			var connectionString = builder.Configuration.GetConnectionString("Postgres");
			builder.Services.AddDbContext<AuthDbContext>(opt => { opt.UseNpgsql(connectionString); });
		}
	}
}