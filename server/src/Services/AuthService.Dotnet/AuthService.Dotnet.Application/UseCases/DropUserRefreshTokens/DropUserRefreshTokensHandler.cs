using AuthService.Dotnet.Application.Common.Models;
using AuthService.Dotnet.Application.Contracts;
using MediatR;

namespace AuthService.Dotnet.Application.UseCases.DropUserRefreshTokens
{
	public class DropUserRefreshTokensHandler(IAuthHelperService authHelperService)
		: ICommandHandler<DropUserRefreshTokensCommand, Unit>
	{
		public async Task<Unit> Handle(DropUserRefreshTokensCommand request, CancellationToken cancellationToken)
		{
			await authHelperService.DropAllUserRefreshTokensAsync(request.UserId, cancellationToken);
			return Unit.Value;
		}
	}
}
