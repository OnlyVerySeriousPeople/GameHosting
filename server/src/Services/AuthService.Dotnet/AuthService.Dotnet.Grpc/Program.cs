using AuthService.Dotnet.Application;
using AuthService.Dotnet.Application.UseCases.Register;
using AuthService.Dotnet.Infrastructure;
using AuthService.Dotnet.Persistence;
using AuthService.Dotnet.Persistence.Extensions;

var builder = WebApplication.CreateBuilder(args);

builder.AddAuthApplication();
builder.AddAuthPersistence();
builder.AddAuthInfrastructure();

builder.Services.AddMediatR(cfg =>
{
	cfg.RegisterServicesFromAssembly(typeof(RegisterHandler).Assembly);
});

builder.Services.AddGrpc();

var app = builder.Build();

app.UseMigration();

app.MapGrpcService<AuthService.Dotnet.Grpc.Services.AuthService>();

app.Run();
