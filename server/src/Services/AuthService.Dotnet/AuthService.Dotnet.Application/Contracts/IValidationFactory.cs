using AuthService.Dotnet.Domain.Entities;

namespace AuthService.Dotnet.Application.Contracts
{
	public interface IValidationFactory
	{
		Result<IValidator<T>> GetValidator<T>(Type requestType);
	}
}