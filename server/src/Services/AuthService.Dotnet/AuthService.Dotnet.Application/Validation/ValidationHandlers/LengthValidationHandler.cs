namespace AuthService.Dotnet.Application.Validation.ValidationHandlers
{
	public class LengthValidationHandler<T>(int minLength, int maxLength)
		: BaseValidationHandler<T>
	{
		protected override (bool IsSuccess, string Error) Validate(T request)
		{
			if (request is not string str)
				throw new InvalidOperationException(
					$"LengthValidationHandler can only be used with string type, but got {typeof(T).Name}.");

			if (str.Length < minLength || str.Length > maxLength)
				return (false, ErrorMessage);

			return (true, string.Empty);
		}
	}
}