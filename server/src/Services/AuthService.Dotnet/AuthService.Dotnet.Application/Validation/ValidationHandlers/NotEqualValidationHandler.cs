namespace AuthService.Dotnet.Application.Validation.ValidationHandlers
{
	public class NotEqualValidationHandler<T>(IEnumerable<T> list)
		: BaseValidationHandler<T>
	{
		protected override (bool IsSuccess, string Error) Validate(T request)
		{
			if (list.Contains(request))
				return (false, ErrorMessage);

			return (true, string.Empty);
		}
	}
}