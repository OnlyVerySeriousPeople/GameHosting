namespace AuthService.Dotnet.Application.Validation.ValidationHandlers
{
	public class NotEmptyValidationHandler<T>
		: BaseValidationHandler<T>
	{
		protected override (bool IsSuccess, string Error) Validate(T request)
		{
			if (request is string str)
			{
				if (string.IsNullOrEmpty(str))
					return (false, ErrorMessage);

				return (true, string.Empty);
			}

			if (request is not null)
				return (true, string.Empty);

			return (false, ErrorMessage);
		}
	}
}