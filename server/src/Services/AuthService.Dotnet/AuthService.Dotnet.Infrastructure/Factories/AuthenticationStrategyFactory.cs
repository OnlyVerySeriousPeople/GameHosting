using AuthService.Dotnet.Application.Contracts;
using AuthService.Dotnet.Domain.Constants;
using AuthService.Dotnet.Infrastructure.Strategies.AuthenticationStrategies;

namespace AuthService.Dotnet.Infrastructure.Factories
{
	public class AuthenticationStrategyFactory(IServiceProvider serviceProvider) : IStrategyFactory<IAuthenticationStrategy>
	{
		private readonly Dictionary<string, Type> _strategies = new()
		{
			{ AuthServiceConstants.CredentialsProviderName, typeof(CredentialsAuthenticationStrategy) },
			{ AuthServiceConstants.GoogleProviderName, typeof(GoogleAuthenticationStrategy) }
		};
		public IAuthenticationStrategy GetStrategy(string providerName)
		{
			if (!_strategies.TryGetValue(providerName.ToLower(), out var strategyType))
				throw new NotSupportedException(
					$"Authentication provider '{providerName}' is not supported.");

			var service = serviceProvider.GetService(strategyType);
			if (service is not IAuthenticationStrategy strategy)
				throw new InvalidOperationException(
					$"Type '{strategyType.Name}' is not registered in DI as IAuthenticationStrategy.");

			return strategy;
		}
	}
}
