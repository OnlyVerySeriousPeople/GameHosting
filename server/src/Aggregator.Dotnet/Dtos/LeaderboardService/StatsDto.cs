namespace Aggregator.Dotnet.Dtos.LeaderboardService
{
	public record StatsDto(uint Score, Dictionary<string, object>? Custom);
}
