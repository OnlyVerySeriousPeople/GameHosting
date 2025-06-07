using AuthService.Dotnet.Application.Common.Models;
using AuthService.Dotnet.Application.Contracts;
using AuthService.Dotnet.Domain.Entities;
using MediatR;

namespace AuthService.Dotnet.Application.UseCases.RemoveUser
{
	public class RemoveUserHandler(IAuthHelperService authHelperService) : ICommandHandler<RemoveUserCommand, Result<Unit>>
	{
		public async Task<Result<Unit>> Handle(RemoveUserCommand command, CancellationToken cancellationToken)
		{
			var result = await authHelperService.RemoveAllUserDataAsync(command.UserId, cancellationToken);

			if (!result.IsSuccess)
				return Result<Unit>.Failure(result.Error!);

			return result;
		}
	}
}