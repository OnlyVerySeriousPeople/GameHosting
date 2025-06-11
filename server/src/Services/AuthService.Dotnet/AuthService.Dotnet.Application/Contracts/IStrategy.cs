namespace AuthService.Dotnet.Application.Contracts
{
	public interface IStrategy
	{
		public string ProviderName { get; }
	}
}