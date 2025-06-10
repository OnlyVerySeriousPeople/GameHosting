using System.Text.RegularExpressions;

namespace AuthService.Dotnet.Application.Validation.ValidationHandlers
{
	public class EmailValidationHandler<T>
		: BaseValidationHandler<T>
	{
		protected override (bool IsSuccess, string Error) Validate(T request)
		{
			if (request is not string str)
				throw new InvalidOperationException(
					$"EmailValidationHandler can only be used with string type, but got {typeof(T).Name}.");

			var regex = new Regex(@"^[\w\-\.]+@([\w-]+\.)+[\w-]{2,4}$");

			if (!regex.IsMatch(str))
				return (false, ErrorMessage);

			return (true, string.Empty);
		}
	}
}