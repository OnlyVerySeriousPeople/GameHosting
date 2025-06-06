using AuthService.Dotnet.Infrastructure.Extensions;
using Microsoft.Extensions.Hosting;

namespace AuthService.Dotnet.Infrastructure
{
	public static class DependencyInjection
	{
		public static IHostApplicationBuilder AddAuthInfrastructure(this IHostApplicationBuilder builder)
		{
			var config = builder.Configuration;

			builder.Services.AddConfiguredExchangeRedisCache(config);
			return builder;
		}
	}
}