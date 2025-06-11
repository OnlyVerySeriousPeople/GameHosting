using AuthService.Dotnet.Application.Contracts;
using AuthService.Dotnet.Application.Validation.Builder;

namespace AuthService.Dotnet.Application.Validation.Validators
{
	public class CodeValidationBuilder : IValidationBuilder<string>
	{
		public IValidationHandler<string> Build(ValidationChainBuilder<string> builder)
		{
			builder
				.SetNotEmptyRule().WithMessage("Code is required.");
			return builder.Build()!;
		}
	}
}
