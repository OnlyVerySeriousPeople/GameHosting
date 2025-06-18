namespace Aggregator.Dotnet.Dtos.GameService
{
	public record GameFiltersDto(
		string? Name,
		bool UseCategories,
		string? AuthorId);
}