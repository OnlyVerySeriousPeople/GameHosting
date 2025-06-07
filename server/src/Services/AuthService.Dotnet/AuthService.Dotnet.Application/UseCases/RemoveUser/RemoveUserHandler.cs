using AuthService.Dotnet.Application.Common.Models;
using AuthService.Dotnet.Application.Contracts;
using MediatR;

namespace AuthService.Dotnet.Application.UseCases.RemoveUser
{
	public class RemoveUserHandler(IAuthHelperService authHelperService) : ICommandHandler<RemoveUserCommand, Unit>
	{
		public async Task<Unit> Handle(RemoveUserCommand command, CancellationToken cancellationToken)
		{
			await authHelperService.RemoveAllUserDataAsync(command.UserId, cancellationToken);
			return Unit.Value;
		}
	}
}