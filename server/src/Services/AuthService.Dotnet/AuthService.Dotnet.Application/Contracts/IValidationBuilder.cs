using AuthService.Dotnet.Application.Validation.Builder;

namespace AuthService.Dotnet.Application.Contracts
{
	public interface IValidationBuilder<T>
	{
		public IValidationHandler<T> Build(ValidationChainBuilder<T> builder);
	}
}