using MediatR;

namespace AuthService.Dotnet.Contracts
{
	public interface IQueryHandler<in TRequest, TResponse>
		: IRequestHandler<TRequest, TResponse>
		where TRequest : IQuery<TResponse>
		where TResponse : notnull
	{
	}
}
