using MediatR;

namespace AuthService.Dotnet.Application.Contracts
{
	public interface ICommand : IRequest<Unit>
	{
	}

	public interface ICommand<out TResponse>
		: IRequest<TResponse>
	{
	}
}