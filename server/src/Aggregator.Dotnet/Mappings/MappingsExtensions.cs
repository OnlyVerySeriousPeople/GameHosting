using Aggregator.Dotnet.Dtos;
using Aggregator.Dotnet.Dtos.GameService;
using Aggregator.Dotnet.Dtos.LeaderboardService;
using AuthService.Dotnet.Grpc;
using Game.V1;
using Google.Protobuf.WellKnownTypes;
using Leaderboard.V1;

namespace Aggregator.Dotnet.Mappings
{
	public static class MappingsExtensions
	{
		public static RegisterRequest ToGrpc(this RegisterRequestDto dto) =>
			new RegisterRequest
			{
				Username = dto.Username,
				Password = dto.Password,
				Email = dto.Email,
				PlayerId = Guid.NewGuid().ToString()
			};

		public static LoginRequest ToGrpc(this LoginRequestDto dto) =>
			new LoginRequest
			{
				EmailPassword = new EmailPassword
				{
					Email = dto.Email,
					Password = dto.Password
				},
				Provider = dto.Provider
			};

		public static RefreshTokenRequest ToGrpc(this RefreshTokenRequestDto dto) =>
			new RefreshTokenRequest
			{
				Token = dto.Token,
				Prefix = dto.Prefix
			};

		public static GameMetadata ToGrpc(this GameMetadataDto dto) =>
			new GameMetadata
			{
				Name = dto.Name,
				Description = dto.Description,
				Categories = { dto.Categories },
				IconUrl = dto.IconUrl
			};

		public static CreateGameRequest ToGrpc(this CreateGameRequestDto dto) =>
			new CreateGameRequest
			{
				AuthorId = dto.AuthorId,
				Metadata = dto.Metadata.ToGrpc()
			};

		public static GetGamesRequest ToGrpc(this GetGamesRequestDto dto)
		{
			var request = new GetGamesRequest
			{
				Offset = dto.Offset,
				Limit = dto.Limit
			};

			if (dto.FiltersBy.UseCategories == true)
			{
				request.UseCategories = true;
				request.Categories.AddRange(dto.Categories ?? []);
			}
			else if (!string.IsNullOrEmpty(dto.FiltersBy.AuthorId))
			{
				request.AuthorId = dto.FiltersBy.AuthorId;
			}
			else if (!string.IsNullOrEmpty(dto.FiltersBy.Name))
			{
				request.Name = dto.FiltersBy.Name;
			}

			return request;
		}

		public static GetLeaderboardRequest ToGrpc(this GetLeaderboardRequestDto dto) =>
			new GetLeaderboardRequest
			{
				GameId = dto.GameId,
				EntryLimit = dto.EntryLimit,
				ScoreCursor = dto.ScoreCursor
			};

		public static Stats ToGrpc(this StatsDto dto)
		{
			if (dto.Custom is null)
				return new Stats
				{
					Custom = null,
					Score = dto.Score,
				};

			return new Stats
			{
				Custom = DictionaryToStruct(dto.Custom),
				Score = dto.Score,
			};
		}

		public static UpdatePlayerStatsRequest ToGrpc(this UpdatePlayerStatsRequestDto dto) =>
			new UpdatePlayerStatsRequest
			{
				GameId = dto.GameId,
				PlayerId = dto.PlayerId,
				Stats = dto.Stats.ToGrpc(),
			};

		public static GetPlayerStatsRequest ToGrpc(this GetPlayerStatsRequestDto dto) =>
			new GetPlayerStatsRequest
			{
				GameId = dto.GameId,
			};

		private static Struct DictionaryToStruct(Dictionary<string, object> dict)
		{
			var s = new Struct();
			foreach (var kvp in dict)
			{
				s.Fields[kvp.Key] = ToValue(kvp.Value);
			}

			return s;
		}

		private static Value ToValue(object? obj)
		{
			return obj switch
			{
				null => Value.ForNull(),
				string s => Value.ForString(s),
				double d => Value.ForNumber(d),
				float f => Value.ForNumber(f),
				int i => Value.ForNumber(i),
				long l => Value.ForNumber(l),
				bool b => Value.ForBool(b),
				Dictionary<string, object> dict => Value.ForStruct(DictionaryToStruct(dict)),
				_ => throw new NotSupportedException($"Unsupported type: {obj?.GetType().Name}")
			};
		}
	}
}