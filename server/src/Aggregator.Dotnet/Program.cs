using static AuthService.Dotnet.Grpc.AuthService;

var builder = WebApplication.CreateBuilder(args);
var config = builder.Configuration;

builder.Services.AddGrpcClient<AuthServiceClient>(options =>
{
	options.Address = new Uri(config["GrpcSettings:AuthServiceUrl"] ?? string.Empty);
});

var app = builder.Build();

app.Run();