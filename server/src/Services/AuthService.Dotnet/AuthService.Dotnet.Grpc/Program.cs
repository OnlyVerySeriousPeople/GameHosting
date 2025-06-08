using AuthService.Dotnet.Infrastructure;
using AuthService.Dotnet.Persistence;

var builder = WebApplication.CreateBuilder(args);

builder.AddAuthPersistence();
builder.AddAuthInfrastructure();

builder.Services.AddGrpc();

var app = builder.Build();

app.Run();
