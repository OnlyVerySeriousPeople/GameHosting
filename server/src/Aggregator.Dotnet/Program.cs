using Aggregator.Dotnet.Endpoints;
using AuthClient = AuthService.Dotnet.Grpc.AuthService.AuthServiceClient;
using GameClient = Game.V1.GameService.GameServiceClient;


var builder = WebApplication.CreateBuilder(args);
var config = builder.Configuration;

builder.Services.AddGrpcClient<AuthClient>(options =>
{
	options.Address = new Uri(config["GrpcSettings:AuthServiceUrl"] ?? string.Empty);
});

builder.Services.AddGrpcClient<GameClient>(options =>
{
	options.Address = new Uri(config["GrpcSettings:GameServiceUrl"] ?? string.Empty);
});

var app = builder.Build();

app.MapAuthEndpoints();
app.MapGameEndpoints();

app.Run();