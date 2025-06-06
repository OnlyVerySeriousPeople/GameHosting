namespace AuthService.Dotnet.Application.Contracts
{
	public interface IStrategyFactory<out TStrategy>
		where TStrategy : IStrategy
	{
		TStrategy GetStrategy(string providerName);
	}
}