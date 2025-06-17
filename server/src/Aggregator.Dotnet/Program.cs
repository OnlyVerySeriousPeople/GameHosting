using Aggregator.Dotnet.Endpoints;
using Aggregator.Dotnet.Extensions;

var builder = WebApplication.CreateBuilder(args);
var config = builder.Configuration;

builder.Services.AddConfiguredGrpcClients(config);

var app = builder.Build();

app.MapAuthEndpoints();
app.MapGameEndpoints();
app.MapLeaderboardEndpoints();

app.Run();