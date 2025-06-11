using AuthService.Dotnet.Application.Contracts;
using AuthService.Dotnet.Application.Validation.Builder;

namespace AuthService.Dotnet.Application.Validation.Validators;

public partial class UserIdValidationBuilder : IValidationBuilder<string>
{
	public IValidationHandler<string> Build(ValidationChainBuilder<string> builder)
	{
		builder
			.SetNotEmptyRule().WithMessage("User/Player ID is required.")
			.SetLengthRule(36, 36).WithMessage("User/Player ID must be 36 characters long.");
		return builder.Build()!;
	}
}