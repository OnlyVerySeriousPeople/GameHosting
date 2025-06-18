using AuthClient = AuthService.Dotnet.Grpc.AuthService.AuthServiceClient;
using GameClient = Game.V1.GameService.GameServiceClient;
using LeaderboardClient = Leaderboard.V1.LeaderboardService.LeaderboardServiceClient;

namespace Aggregator.Dotnet.Extensions
{
	public static class ConfiguredGrpcClients
	{
		public static void AddConfiguredGrpcClients(this IServiceCollection services, IConfiguration config)
		{
			services.AddGrpcClient<AuthClient>(options =>
			{
				options.Address = new Uri(config["GrpcSettings:AuthServiceUrl"] ?? string.Empty);
			});

			services.AddGrpcClient<GameClient>(options =>
			{
				options.Address = new Uri(config["GrpcSettings:GameServiceUrl"] ?? string.Empty);
			});

			services.AddGrpcClient<LeaderboardClient>(options =>
			{
				options.Address = new Uri(config["GrpcSettings:LeaderboardServiceUrl"] ?? string.Empty);
			});
		}
	}
}