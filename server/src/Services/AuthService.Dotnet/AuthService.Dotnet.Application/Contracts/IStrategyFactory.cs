namespace AuthService.Dotnet.Application.Contracts
{
	internal interface IStrategyFactory<out TStrategy>
		where TStrategy : IStrategy
	{
		TStrategy GetStrategy(string providerName);
	}
}