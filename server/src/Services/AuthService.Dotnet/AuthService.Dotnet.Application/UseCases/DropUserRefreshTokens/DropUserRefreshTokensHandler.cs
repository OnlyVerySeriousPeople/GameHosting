using AuthService.Dotnet.Application.Common.Models;
using AuthService.Dotnet.Application.Contracts;
using MediatR;

namespace AuthService.Dotnet.Application.UseCases.DropUserRefreshTokens
{
	public class DropUserRefreshTokensHandler(IAuthHelper authHelper)
		: ICommandHandler<DropUserRefreshTokensCommand, Unit>
	{
		public async Task<Unit> Handle(DropUserRefreshTokensCommand request, CancellationToken cancellationToken)
		{
			await authHelper.DropAllUserRefreshTokensAsync(request.UserId, cancellationToken);
			return Unit.Value;
		}
	}
}
