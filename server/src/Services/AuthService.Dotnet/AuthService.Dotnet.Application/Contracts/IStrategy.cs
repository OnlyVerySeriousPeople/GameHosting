namespace AuthService.Dotnet.Application.Contracts
{
	internal interface IStrategy
	{
		public string ProviderName { get; }
	}
}