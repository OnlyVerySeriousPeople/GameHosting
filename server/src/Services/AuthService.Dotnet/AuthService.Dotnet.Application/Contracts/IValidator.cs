using AuthService.Dotnet.Domain.Entities;
using MediatR;

namespace AuthService.Dotnet.Application.Contracts
{
	public interface IValidator<in T>
	{
		public Result<Unit> Validate(T request);
	}
}
