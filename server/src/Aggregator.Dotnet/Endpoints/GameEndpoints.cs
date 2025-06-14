using Aggregator.Dotnet.Dtos.GameService;
using Aggregator.Dotnet.Mappings;
using Game.V1;
using Microsoft.AspNetCore.Mvc;
using GameClient = Game.V1.GameService.GameServiceClient;

namespace Aggregator.Dotnet.Endpoints
{
	public static class GameEndpoints
	{
		public static void MapGameEndpoints(this IEndpointRouteBuilder app)
		{
			app.MapPost("/api/game/create", async (
				[FromBody] CreateGameRequestDto request,
				[FromServices] GameClient gameClient,
				CancellationToken cancellationToken) =>
			{
				await gameClient.CreateGameAsync(request.ToGrpc(), cancellationToken: cancellationToken);

				return Results.Created();
			});

			app.MapPut("/api/game/update/{gameId}", async (
				string gameId,
				[FromBody] GameMetadataDto gameMetadata,
				[FromServices] GameClient gameClient,
				CancellationToken cancellationToken) =>
			{
				UpdateGameRequest request = new()
				{
					GameId = gameId,
					Metadata = gameMetadata.ToGrpc()
				};

				await gameClient.UpdateGameAsync(request, cancellationToken: cancellationToken);

				return Results.NoContent();
			});

			app.MapPut("/api/game/incplays/{gameId}", async (
				string gameId,
				[FromServices] GameClient gameClient,
				CancellationToken cancellationToken) =>
			{
				IncGamePlaysRequest request = new() { GameId = gameId };

				await gameClient.IncGamePlaysAsync(request, cancellationToken: cancellationToken);

				return Results.NoContent();
			});

			app.MapDelete("/api/game/{gameId}", async (
				string gameId,
				[FromServices] GameClient gameClient,
				CancellationToken cancellationToken) =>
			{
				DeleteGameRequest request = new() { GameId = gameId };

				await gameClient.DeleteGameAsync(request, cancellationToken: cancellationToken);

				return Results.NoContent();
			});

			app.MapGet("/api/game/categories", async (
				[FromQuery] bool onlyUsed,
				[FromServices] GameClient gameClient,
				CancellationToken cancellationToken) =>
			{
				GetGameCategoriesRequest request = new() { OnlyUsed = onlyUsed };
				var response = await gameClient.GetGameCategoriesAsync(
					request,
					cancellationToken: cancellationToken);

				return Results.Ok(response.Categories);
			});

			app.MapGet("/api/games", async (
				[FromBody] GetGamesRequestDto request,
				[FromServices] GameClient gameClient,
				CancellationToken cancellationToken) =>
			{
				var response = await gameClient.GetGamesAsync(
					request.ToGrpc(),
					cancellationToken: cancellationToken);

				return Results.Ok(response.Games);
			});
		}
	}
}