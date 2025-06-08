using AuthService.Dotnet.Infrastructure;
using AuthService.Dotnet.Persistence;

var builder = WebApplication.CreateBuilder(args);

builder.AddAuthPersistence();
builder.AddAuthInfrastructure();

builder.Services.AddMediatR(ctg =>
{
	ctg.RegisterServicesFromAssemblyContaining<Program>();
});

builder.Services.AddGrpc();

var app = builder.Build();

app.MapGrpcService<AuthService.Dotnet.Grpc.Services.AuthService>();

app.Run();
