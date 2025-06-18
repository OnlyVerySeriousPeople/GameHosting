namespace Aggregator.Dotnet.Dtos.LeaderboardService
{
	public record GetLeaderboardRequestDto(string GameId, uint EntryLimit, uint ScoreCursor);
}
