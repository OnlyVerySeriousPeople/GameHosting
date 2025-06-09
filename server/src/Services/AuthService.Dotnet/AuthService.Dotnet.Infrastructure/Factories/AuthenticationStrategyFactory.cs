using AuthService.Dotnet.Application.Contracts;
using AuthService.Dotnet.Domain.Constants;
using AuthService.Dotnet.Domain.Entities;
using AuthService.Dotnet.Domain.Exceptions;
using AuthService.Dotnet.Infrastructure.Strategies.AuthenticationStrategies;

namespace AuthService.Dotnet.Infrastructure.Factories
{
	public class AuthenticationStrategyFactory(IServiceProvider serviceProvider)
		: IStrategyFactory<IAuthenticationStrategy>
	{
		private readonly Dictionary<string, Type> _strategies = new()
		{
			{ AuthServiceConstants.CredentialsProviderName.ToLower(), typeof(CredentialsAuthenticationStrategy) },
			{ AuthServiceConstants.GoogleProviderName.ToLower(), typeof(GoogleAuthenticationStrategy) }
		};

		public Result<IAuthenticationStrategy> GetStrategy(string providerName)
		{
			if (!_strategies.TryGetValue(providerName.ToLower(), out var strategyType))
				return Result<IAuthenticationStrategy>.Failure(
					OperationErrors.NotSupported("Authentication provider", providerName));

			var service = serviceProvider.GetService(strategyType);
			if (service is not IAuthenticationStrategy strategy)
				return Result<IAuthenticationStrategy>.Failure(
					OperationErrors.ImplementationNotRegistered(
						strategyType.Name, "IAuthenticationStrategy"));


			return Result<IAuthenticationStrategy>.Success(strategy);
		}
	}
}