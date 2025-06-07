using AuthService.Dotnet.Application.Common.Models;
using AuthService.Dotnet.Application.Contracts;
using AuthService.Dotnet.Domain.Entities;
using MediatR;

namespace AuthService.Dotnet.Application.UseCases.DropUserRefreshTokens
{
	public class DropUserRefreshTokensHandler(IAuthHelperService authHelperService)
		: ICommandHandler<DropUserRefreshTokensCommand, Result<Unit>>
	{
		public async Task<Result<Unit>> Handle(DropUserRefreshTokensCommand request, CancellationToken cancellationToken)
		{
			var result = await authHelperService.DropAllUserRefreshTokensAsync(request.UserId, cancellationToken);
			if (!result.IsSuccess)
				return Result<Unit>.Failure(result.Error!);

			return Result<Unit>.Success(Unit.Value);
		}
	}
}
