using AuthService.Dotnet.Application.Contracts;
using AuthService.Dotnet.Application.Validation.ValidationHandlers;

namespace AuthService.Dotnet.Application.Validation.Builder
{
	public class ValidationChainBuilder<T>
	{
		private IValidationHandler<T>? _chain;
		private IValidationHandler<T>? _firstHandler;

		public IValidationHandler<T>? Build()
		{
			var chain = _firstHandler;
			_chain = null;
			_firstHandler = null;
			return chain;
		}

		public ValidationChainBuilder<T> SetNotEmptyRule()
		{
			SetHandler(new NotEmptyValidationHandler<T>());
			return this;
		}

		public ValidationChainBuilder<T> SetLengthRule(int min, int max)
		{
			SetHandler(new LengthValidationHandler<T>(min, max));
			return this;
		}

		public ValidationChainBuilder<T> SetEmailRule()
		{
			SetHandler(new EmailValidationHandler<T>());
			return this;
		}

		public ValidationChainBuilder<T> SetOneOfRule(IEnumerable<T> list)
		{
			SetHandler(new OneOfValidationHandler<T>(list));
			return this;
		}

		public ValidationChainBuilder<T> SetNotEqualRule(IEnumerable<T> list)
		{
			SetHandler(new NotEqualValidationHandler<T>(list));
			return this;
		}

		public ValidationChainBuilder<T> WithMessage(string message)
		{
			if (_chain is not null)
				_chain = _chain.WithMessage(message);
			else
				throw new InvalidOperationException("No validation handler set to apply message to.");

			return this;
		}

		private void SetHandler(IValidationHandler<T> handler)
		{
			if (_chain is null)
			{
				_chain = handler;
				_firstHandler = _chain;
			}
			else
				_chain = _chain.Next(handler);
		}
	}
}