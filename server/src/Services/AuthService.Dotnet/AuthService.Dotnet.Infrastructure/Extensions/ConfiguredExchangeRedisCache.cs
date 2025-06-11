using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using StackExchange.Redis;

namespace AuthService.Dotnet.Infrastructure.Extensions
{
	public static class ConfiguredExchangeRedisCache
	{
		public static void AddConfiguredExchangeRedisCache(
			this IServiceCollection services,
			IConfiguration conf)
		{
			var connectionString = conf.GetConnectionString("Redis");

			services.AddStackExchangeRedisCache(options =>
				options.Configuration = connectionString);

			services.AddSingleton<IConnectionMultiplexer>(sp =>
			{
				var options = ConfigurationOptions.Parse(connectionString!);
				return ConnectionMultiplexer.Connect(connectionString!);
			});
		}
	}
}