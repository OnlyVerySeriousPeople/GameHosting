using Aggregator.Dotnet.Dtos;
using AuthService.Dotnet.Grpc;

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
	}
}