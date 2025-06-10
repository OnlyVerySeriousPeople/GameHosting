using AuthService.Dotnet.Application.Contracts;
using AuthService.Dotnet.Domain.Entities;
using AuthService.Dotnet.Domain.Exceptions;
using MediatR;

namespace AuthService.Dotnet.Application.Validation
{
	public abstract class BaseValidator<T> : IValidator<T>
	{
		public abstract Result<Unit> Validate(T request);

		protected Result<Unit> BuildResult(params (bool IsSuccess, string Error)[] validations)
		{
			if (validations.All(v => v.IsSuccess))
				return Result<Unit>.Success(Unit.Value);

			var errors = validations
				.Where(v => !v.IsSuccess && !string.IsNullOrEmpty(v.Error))
				.Select(v => v.Error);

			return Result<Unit>.Failure(ValidationsErrors.ValidationFailed(string.Join("", errors)));
		}
	}
}