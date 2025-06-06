using AuthService.Dotnet.Persistence;

var builder = WebApplication.CreateBuilder(args);

builder.AddAuthPersistence();
builder.Services.AddGrpc();

var app = builder.Build();

app.Run();
