namespace Aggregator.Dotnet.Dtos.GameService
{
	public record GameMetadataDto(
		string Name,
		string Description,
		string Categories,
		string IconUrl);
}