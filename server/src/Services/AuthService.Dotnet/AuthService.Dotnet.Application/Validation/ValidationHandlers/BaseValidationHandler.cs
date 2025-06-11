using AuthService.Dotnet.Application.Contracts;

namespace AuthService.Dotnet.Application.Validation.ValidationHandlers
{
	public abstract class BaseValidationHandler<T> : IValidationHandler<T>
	{
		private IValidationHandler<T>? _next;
		protected string ErrorMessage = string.Empty;

		public IValidationHandler<T> Next(IValidationHandler<T> validator)
		{
			_next = validator;
			return validator;
		}

		public (bool IsSuccess, string Error) Handle(T request)
		{
			var result = Validate(request);

			if (_next is null) return result;


			var next = _next.Handle(request);
			return (
				result.IsSuccess && next.IsSuccess,
				string.Join(" ", result.Error, next.Error));
		}

		protected abstract (bool IsSuccess, string Error) Validate(T request);

		public IValidationHandler<T> WithMessage(string message)
		{
			ErrorMessage = message;
			return this;
		}
	}
}