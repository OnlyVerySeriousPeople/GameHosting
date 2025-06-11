namespace AuthService.Dotnet.Domain.Entities
{
	public class Result<TValue>(TValue? value, Error? error)
	{
		public bool IsSuccess { get; set; } = error == Error.Empty;
		public TValue? Value { get; set; } = value;
		public Error? Error { get; set; } = error;

		public static Result<TValue> Success(TValue value)
			=> new(value, Error.Empty);

		public static Result<TValue> Failure(Error error)
			=> new(default, error);
	}
}