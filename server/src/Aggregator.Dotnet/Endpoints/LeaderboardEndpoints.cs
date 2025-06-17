using Aggregator.Dotnet.Dtos.LeaderboardService;
using Aggregator.Dotnet.Mappings;
using Leaderboard.V1;
using Microsoft.AspNetCore.Mvc;
using LeaderboardClient = Leaderboard.V1.LeaderboardService.LeaderboardServiceClient;

namespace Aggregator.Dotnet.Endpoints
{
	public static class LeaderboardEndpoints
	{
		public static void MapLeaderboardEndpoints(this IEndpointRouteBuilder app)
		{
			app.MapGet("/api/leaderboard", async (
				[FromBody] GetLeaderboardRequestDto request,
				[FromServices] LeaderboardClient leaderboardClient,
				CancellationToken cancellationToken) =>
			{
				var response =
					await leaderboardClient.GetLeaderboardAsync(request.ToGrpc(), cancellationToken: cancellationToken);

				return Results.Ok(response);
			});

			app.MapDelete("/api/leaderboard/{id}", async (
				string id,
				[FromServices] LeaderboardClient leaderboardClient,
				CancellationToken cancellationToken) =>
			{
				DeleteLeaderboardRequest request = new() { GameId = id };

				await leaderboardClient.DeleteLeaderboardAsync(request, cancellationToken: cancellationToken);

				return Results.NoContent();
			});

			app.MapPut("/api/leaderboard/update", async (
				[FromBody] UpdatePlayerStatsRequestDto request,
				[FromServices] LeaderboardClient leaderboardClient,
				CancellationToken cancellationToken) =>
			{
				await leaderboardClient.UpdatePlayerStatsAsync(request.ToGrpc(), cancellationToken: cancellationToken);

				return Results.NoContent();
			});

			app.MapGet("/api/leaderboard/stats/{playerId}", async (
				string playerId,
				[FromBody] GetPlayerStatsRequestDto requestBody,
				[FromServices] LeaderboardClient leaderboardClient,
				CancellationToken cancellationToken) =>
			{
				var request = new GetPlayerStatsRequest
				{
					PlayerId = playerId,
					GameId = requestBody.GameId
				};

				var response =
					await leaderboardClient.GetPlayerStatsAsync(request, cancellationToken: cancellationToken);

				return Results.Ok(response);
			});

			app.MapGet("/api/leaderboard/allstats/{playerId}", async (
				string playerId,
				[FromServices] LeaderboardClient leaderboardClient,
				CancellationToken cancellationToken) =>
			{
				var request = new GetAllPlayerStatsRequest { PlayerId = playerId };
				var response =
					await leaderboardClient.GetAllPlayerStatsAsync(request, cancellationToken: cancellationToken);

				return Results.Ok(response);
			});

			app.MapDelete("/api/leaderboard/allstats/{playerId}", async (
				string playerId,
				[FromServices] LeaderboardClient leaderboardClient,
				CancellationToken cancellationToken) =>
			{
				var request = new DeleteAllPlayerStatsRequest
					{ PlayerId = playerId };

				var response =
					await leaderboardClient.DeleteAllPlayerStatsAsync(request, cancellationToken: cancellationToken);

				return Results.NoContent();
			});
		}
	}
}