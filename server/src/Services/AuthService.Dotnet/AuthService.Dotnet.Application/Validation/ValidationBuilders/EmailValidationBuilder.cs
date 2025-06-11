using AuthService.Dotnet.Application.Contracts;
using AuthService.Dotnet.Application.Validation.Builder;

namespace AuthService.Dotnet.Application.Validation.Validators
{
	public class EmailValidationBuilder : IValidationBuilder<string>
	{
		public IValidationHandler<string> Build(ValidationChainBuilder<string> builder)
		{
			builder
				.SetNotEmptyRule().WithMessage("Email is required.")
				.SetEmailRule().WithMessage("Incorrect email format.");
			return builder.Build()!;
		}
	}
}