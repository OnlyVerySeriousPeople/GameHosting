using AuthService.Dotnet.Application.Contracts;
using AuthService.Dotnet.Domain.Options;
using AuthService.Dotnet.Infrastructure.Extensions;
using AuthService.Dotnet.Infrastructure.Factories;
using AuthService.Dotnet.Infrastructure.Helpers;
using AuthService.Dotnet.Infrastructure.Services;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace AuthService.Dotnet.Infrastructure
{
	public static class DependencyInjection
	{
		public static IHostApplicationBuilder AddAuthInfrastructure(this IHostApplicationBuilder builder)
		{
			var config = builder.Configuration;

			builder.Services.Configure<GoogleAuthOptions>(config.GetSection("Google"));

			builder.Services.AddConfiguredExchangeRedisCache(config);
			builder.Services.AddScoped<IAuthHelperService, AuthHelperService>();
			builder.Services.AddScoped<IGoogleAuthHelperService, GoogleAuthHelperService>();
			builder.Services.AddHttpClient<IGoogleAuthHelperService, GoogleAuthHelperService>();
			builder.Services.AddScoped<ITokenService, TokenService>();	
			builder.Services.AddScoped<IStrategyFactory<IAuthenticationStrategy>, AuthenticationStrategyFactory>();

			return builder;
		}
	}
}