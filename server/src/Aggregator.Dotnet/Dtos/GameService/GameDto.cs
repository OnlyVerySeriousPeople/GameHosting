namespace Aggregator.Dotnet.Dtos.GameService
{
	public record GameDto(
		string Id,
		string AuthorId,
		DateTime UploadedAt,
		int TotalPlaysCount,
		GameMetadataDto Metadata);
}
