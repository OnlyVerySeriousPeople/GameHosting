namespace AuthService.Dotnet.Application.Contracts
{
	public interface IValidationHandler<TRequest>
	{
		IValidationHandler<TRequest> Next(IValidationHandler<TRequest> validator);
		(bool IsSuccess, string Error) Handle(TRequest request);
		IValidationHandler<TRequest> WithMessage(string message);
	}
}
