using MediatR;

namespace AuthService.Dotnet.Contracts
{
	public interface IQuery<out TResponse>
		: IRequest<TResponse>
		where TResponse : notnull
	{
	}
}