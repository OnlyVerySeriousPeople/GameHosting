using AuthService.Dotnet.Application.Behaviors;
using AuthService.Dotnet.Application.Contracts;
using AuthService.Dotnet.Application.UseCases.DropUserRefreshTokens;
using AuthService.Dotnet.Application.UseCases.Login;
using AuthService.Dotnet.Application.UseCases.RefreshToken;
using AuthService.Dotnet.Application.UseCases.Register;
using AuthService.Dotnet.Application.UseCases.RemoveUser;
using AuthService.Dotnet.Application.Validation.Factory;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace AuthService.Dotnet.Application
{
	public static class DependencyInjection
	{
		public static IHostApplicationBuilder AddAuthApplication(this IHostApplicationBuilder builder)
		{
			builder.Services.AddSingleton<LoginValidator>();
			builder.Services.AddSingleton<DropUserRefreshTokensValidator>();
			builder.Services.AddSingleton<RefreshTokenValidator>();
			builder.Services.AddSingleton<RegisterValidator>();
			builder.Services.AddSingleton<RemoveUserValidator>();

			builder.Services.AddScoped<IValidationFactory, ValidatorFactory>();
			builder.Services.AddTransient(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));

			return builder;
		}
	}
}