using Aggregator.Dotnet.Dtos;
using Aggregator.Dotnet.Mappings;
using Microsoft.AspNetCore.Mvc;
using AuthService.Dotnet.Grpc;
using AuthClient = AuthService.Dotnet.Grpc.AuthService.AuthServiceClient;
using Aggregator.Dotnet.Infrastructure;

namespace Aggregator.Dotnet.Endpoints
{
	public static class AuthEndpoints
	{
		public static void MapAuthEndpoints(this IEndpointRouteBuilder app)
		{
			app.MapPost("/api/auth/register", async (
				RegisterRequestDto request,
				[FromServices] AuthClient authClient,
				CancellationToken cancellationToken) =>
			{
				var response = await authClient.RegisterAsync(request.ToGrpc(), cancellationToken: cancellationToken);

				if (response.Error is not null)
					return ErrorsHandler.HandleServiceErrorResponse(response.Error);

				return Results.Created("/api/auth/register", response.Tokens);
			});
			app.MapPost("/api/auth/login", async (
				LoginRequestDto request,
				[FromServices] AuthClient authClient,
				CancellationToken cancellationToken) =>
			{
				var response = await authClient.LoginAsync(request.ToGrpc(), cancellationToken: cancellationToken);

				if (response.Error is not null)
					return ErrorsHandler.HandleServiceErrorResponse(response.Error);

				return Results.Ok(response.Tokens);
			});

			app.MapPost("/api/auth/refresh", async (
				[FromBody] RefreshTokenRequestDto request,
				[FromServices] AuthClient authClient,
				CancellationToken cancellationToken) =>
			{
				var response =
					await authClient.RefreshTokenAsync(request.ToGrpc(), cancellationToken: cancellationToken);

				if (response.Error is not null)
					return ErrorsHandler.HandleServiceErrorResponse(response.Error);

				return Results.Ok(response.Tokens);
			});

			app.MapDelete("/api/auth/remove/{id}", async (
				string id,
				[FromServices] AuthClient authClient,
				CancellationToken cancellationToken) =>
			{
				var response = await authClient.RemoveUserAsync(new RemoveUserRequest { UserId = id },
					cancellationToken: cancellationToken);
				if (response.Error is not null && !IsEmpty(response.Error))
					return ErrorsHandler.HandleServiceErrorResponse(response.Error);

				return Results.Empty;
			});

			app.MapDelete("/api/auth/droptokens/{id}", async (
				string id,
				[FromServices] AuthClient authClient,
				CancellationToken cancellationToken) =>
			{
				var response =
					await authClient.DropUserRefreshTokenAsync(new DropUserRefreshTokenRequest { UserId = id },
						cancellationToken: cancellationToken);
				if (response.Error is not null && !IsEmpty(response.Error))
					return ErrorsHandler.HandleServiceErrorResponse(response.Error);

				return Results.Empty;
			});

			app.MapGet("/api/auth/googlelink", async (
				[FromServices] AuthClient authClient,
				CancellationToken cancellationToken) =>
			{
				var response = await authClient.GetGoogleAuthLinkAsync(new GetGoogleAuthLinkRequest(),
					cancellationToken: cancellationToken);

				return Results.Ok(response);
			});
		}

		private static bool IsEmpty(Error error)
		{
			return string.IsNullOrWhiteSpace(error.Description) &&
			       string.IsNullOrWhiteSpace(error.Type);
		}
	}
}