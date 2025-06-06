using AuthService.Dotnet.Application.Contracts;
using AuthService.Dotnet.Infrastructure.Extensions;
using AuthService.Dotnet.Infrastructure.Helpers;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace AuthService.Dotnet.Infrastructure
{
	public static class DependencyInjection
	{
		public static IHostApplicationBuilder AddAuthInfrastructure(this IHostApplicationBuilder builder)
		{
			var config = builder.Configuration;

			builder.Services.AddConfiguredExchangeRedisCache(config);
			builder.Services.AddScoped<IAuthHelper, AuthHelper>();
			return builder;
		}
	}
}