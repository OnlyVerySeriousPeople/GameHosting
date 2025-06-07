using AuthService.Dotnet.Domain.Entities;

namespace AuthService.Dotnet.Application.Contracts
{
	public interface IStrategyFactory<TStrategy>
		where TStrategy : IStrategy
	{
		Result<TStrategy> GetStrategy(string providerName);
	}
}