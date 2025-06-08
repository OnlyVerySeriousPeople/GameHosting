using AuthService.Dotnet.Application.Common.Models;
using AuthService.Dotnet.Grpc.Common.Mappings;
using Grpc.Core;
using MediatR;
using static AuthService.Dotnet.Grpc.AuthService;

namespace AuthService.Dotnet.Grpc.Services
{
	public class AuthService(IMediator mediator) : AuthServiceBase
	{
		public override async Task<RegisterResponse> Register(RegisterRequest request, ServerCallContext context)
		{
			var command = request.ToCommand();

			var result = await mediator.Send(command, context.CancellationToken);

			if (result.IsSuccess)
			{
				return new RegisterResponse
				{
					Tokens = result.Value!.ToResponse(),
				};
			}

			return new RegisterResponse
			{
				Error = result.Error!.ToResponse()
			};
		}

		public override async Task<LoginResponse> Login(LoginRequest request, ServerCallContext context)
		{
			var command = request.ToCommand();

			var result = await mediator.Send(command, context.CancellationToken);

			if (result.IsSuccess)
			{
				return new LoginResponse
				{
					Tokens = result.Value!.ToResponse(),
				};
			}

			return new LoginResponse
			{
				Error = result.Error!.ToResponse()
			};
		}

		public override async Task<RefreshTokenResponse> RefreshToken(RefreshTokenRequest request, ServerCallContext context)
		{
			var command = request.ToCommand();

			var result = await mediator.Send(command, context.CancellationToken);

			if (result.IsSuccess)
			{
				return new RefreshTokenResponse
				{
					Tokens = result.Value!.ToResponse(),
				};
			}

			return new RefreshTokenResponse
			{
				Error = result.Error!.ToResponse()
			};
		}

		public override async Task<RemoveUserResponse> RemoveUser(RemoveUserRequest request, ServerCallContext context)
		{
			var command = request.ToCommand();

			var result = await mediator.Send(command, context.CancellationToken);

			return new RemoveUserResponse
			{
				Error = result.Error!.ToResponse()
			};
		}

		public override async Task<DropUserRefreshTokenResponse> DropUserRefreshToken(DropUserRefreshTokenRequest request, ServerCallContext context)
		{
			var command = request.ToCommand();

			var result = await mediator.Send(command, context.CancellationToken);

			return new DropUserRefreshTokenResponse
			{
				Error = result.Error!.ToResponse()
			};
		}

		public override async Task<GetGoogleAuthLinkResponse> GetGoogleAuthLink(GetGoogleAuthLinkRequest request, ServerCallContext context)
		{
			var query = new GetGoogleAuthLinkQuery();

			var result = await mediator.Send(query, context.CancellationToken);

			return new GetGoogleAuthLinkResponse
			{
				Link = result.Url
			};
		}
	}
}