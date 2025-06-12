using Aggregator.Dotnet.Endpoints;
using AuthClient = AuthService.Dotnet.Grpc.AuthService.AuthServiceClient;

var builder = WebApplication.CreateBuilder(args);
var config = builder.Configuration;

builder.Services.AddGrpcClient<AuthClient>(options =>
{
	options.Address = new Uri(config["GrpcSettings:AuthServiceUrl"] ?? string.Empty);
});

var app = builder.Build();

app.MapAuthEndpoints();

app.Run();