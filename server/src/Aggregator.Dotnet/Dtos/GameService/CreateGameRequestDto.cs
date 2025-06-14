namespace Aggregator.Dotnet.Dtos.GameService
{
	public record CreateGameRequestDto(string AuthorId, GameMetadataDto Metadata);
}