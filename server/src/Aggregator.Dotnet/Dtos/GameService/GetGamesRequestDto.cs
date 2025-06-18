namespace Aggregator.Dotnet.Dtos.GameService
{
	public record GetGamesRequestDto(
		GameFiltersDto FiltersBy,
		IEnumerable<string>? Categories,
		uint Offset,
		uint Limit);
}