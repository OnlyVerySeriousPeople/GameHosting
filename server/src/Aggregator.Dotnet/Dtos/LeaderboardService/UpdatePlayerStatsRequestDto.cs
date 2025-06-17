namespace Aggregator.Dotnet.Dtos.LeaderboardService
{
	public record UpdatePlayerStatsRequestDto(string GameId, string PlayerId, StatsDto Stats);
}
