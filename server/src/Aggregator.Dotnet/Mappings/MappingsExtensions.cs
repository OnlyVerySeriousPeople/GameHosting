using Aggregator.Dotnet.Dtos;
using Aggregator.Dotnet.Dtos.GameService;
using AuthService.Dotnet.Grpc;
using Game.V1;

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

		public static GetGamesRequest ToGrpc(this GetGamesRequestDto dto) =>
			new GetGamesRequest
			{
				Name = dto.FiltersBy.Name,
				UseCategories = dto.FiltersBy.UseCategories,
				AuthorId = dto.FiltersBy.AuthorId,
				Categories = { dto.Categories },
				Offset = dto.Offset,
				Limit = dto.Limit,
			};

	}
}