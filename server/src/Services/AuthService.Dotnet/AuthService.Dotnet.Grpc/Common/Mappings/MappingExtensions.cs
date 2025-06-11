using AuthService.Dotnet.Application.Common.Models;
using Google.Protobuf.WellKnownTypes;
using DomainEntities = AuthService.Dotnet.Domain.Entities;

namespace AuthService.Dotnet.Grpc.Common.Mappings
{
	public static class MappingExtensions
	{
		public static RegisterCommand ToCommand(this RegisterRequest request) =>
			new RegisterCommand(
				request.Username,
				request.Password,
				request.Email,
				request.PlayerId);

		public static LoginCommand ToCommand(this LoginRequest request) =>
			new LoginCommand(
				request.EmailPassword.Email,
				request.EmailPassword.Password,
				request.Code,
				request.Provider);

		public static RefreshTokenCommand ToCommand(this RefreshTokenRequest request) =>
			new RefreshTokenCommand(
				request.Token,
				request.Prefix);

		public static RemoveUserCommand ToCommand(this RemoveUserRequest request) =>
			new RemoveUserCommand(
				request.UserId);

		public static DropUserRefreshTokensCommand ToCommand(this DropUserRefreshTokenRequest request) =>
			new DropUserRefreshTokensCommand(
				request.UserId);

		public static Error ToResponse(this DomainEntities.Error error) =>
			new Error
			{
				Type = error.Type,
				Description = error.Description,
				RestCode = error.RestCode
			};

		public static Tokens ToResponse(this RegisterResult result) =>
			new Tokens
			{
				JwtToken = result.JwtToken,
				JwtExpiry = Timestamp.FromDateTime(result.JwtExpiry.ToUniversalTime()),
				RefreshToken = result.RefreshToken,
				RefreshExpiry = Timestamp.FromDateTime(result.RefreshExpiry.ToUniversalTime()),
			};

		public static Tokens ToResponse(this LoginResult result) =>
			new Tokens
			{
				JwtToken = result.JwtToken,
				JwtExpiry = Timestamp.FromDateTime(result.JwtExpiry.ToUniversalTime()),
				RefreshToken = result.RefreshToken,
				RefreshExpiry = Timestamp.FromDateTime(result.RefreshExpiry.ToUniversalTime()),
			};

		public static Tokens ToResponse(this RefreshTokenResult result) =>
			new Tokens
			{
				JwtToken = result.JwtToken,
				JwtExpiry = Timestamp.FromDateTime(result.JwtExpiry.ToUniversalTime()),
				RefreshToken = result.RefreshToken,
				RefreshExpiry = Timestamp.FromDateTime(result.RefreshExpiry.ToUniversalTime()),
			};
	}
}