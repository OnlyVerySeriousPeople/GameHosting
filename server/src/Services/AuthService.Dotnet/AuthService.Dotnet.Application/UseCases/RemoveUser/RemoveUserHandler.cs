using AuthService.Dotnet.Application.Common.Models;
using AuthService.Dotnet.Application.Contracts;
using MediatR;

namespace AuthService.Dotnet.Application.UseCases.RemoveUser
{
	public class RemoveUserHandler(IAuthHelper authHelper) : ICommandHandler<RemoveUserCommand, Unit>
	{
		public async Task<Unit> Handle(RemoveUserCommand command, CancellationToken cancellationToken)
		{
			await authHelper.RemoveAllUserDataAsync(command.UserId, cancellationToken);
			return Unit.Value;
		}
	}
}