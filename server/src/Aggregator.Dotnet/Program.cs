using Aggregator.Dotnet.Endpoints;
using Aggregator.Dotnet.Extensions;
using Aggregator.Dotnet.Infrastructure;

var builder = WebApplication.CreateBuilder(args);
var config = builder.Configuration;

builder.Services.AddConfiguredGrpcClients(config);
builder.Services.AddExceptionHandler<GlobalErrorHandler>();

var app = builder.Build();

app.MapAuthEndpoints();
app.MapGameEndpoints();
app.MapLeaderboardEndpoints();

app.UseExceptionHandler(opt => { });

app.Run();