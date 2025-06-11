using AuthService.Dotnet.Application.Contracts;
using AuthService.Dotnet.Application.Validation.Builder;

namespace AuthService.Dotnet.Application.Validation.Validators
{
	public class UsernameValidationBuilder : IValidationBuilder<string>
	{
		public IValidationHandler<string> Build(ValidationChainBuilder<string> builder)
		{
			builder
				.SetNotEmptyRule().WithMessage("Username is required.")
				.SetLengthRule(6, 12).WithMessage("Username must be between 6 and 12 characters long.");
			return builder.Build()!;
		}
	}
}