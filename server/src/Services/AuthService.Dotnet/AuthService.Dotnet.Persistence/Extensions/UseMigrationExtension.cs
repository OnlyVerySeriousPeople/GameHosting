using AuthService.Dotnet.Persistence.Data;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace AuthService.Dotnet.Persistence.Extensions
{
	public static class UseMigrationExtension
	{
		public static IApplicationBuilder UseMigration(this IApplicationBuilder app)
		{
			using var scope = app.ApplicationServices.CreateScope();
			var db = scope.ServiceProvider.GetRequiredService<AuthDbContext>();

			const int maxAttempts = 10;
			var attempts = 0;
			var delay = TimeSpan.FromSeconds(2);

			while (true)
			{
				try
				{
					db.Database.Migrate();
					break;
				}
				catch (Exception ex) when (attempts < maxAttempts)
				{
					attempts++;
					Console.WriteLine($"[Migration] Failed attempt {attempts}: {ex.Message}");
					Thread.Sleep(delay);
				}
			}

			return app;
		}
	}
}