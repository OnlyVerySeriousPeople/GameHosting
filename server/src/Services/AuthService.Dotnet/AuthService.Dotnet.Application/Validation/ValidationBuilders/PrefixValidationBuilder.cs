using AuthService.Dotnet.Application.Contracts;
using AuthService.Dotnet.Application.Validation.Builder;
using AuthService.Dotnet.Domain.Constants;

namespace AuthService.Dotnet.Application.Validation.Validators
{
	public class PrefixValidationBuilder : IValidationBuilder<string>
	{
		public IValidationHandler<string> Build(ValidationChainBuilder<string> builder)
		{
			List<string> prefixes =
			[
				AuthServiceConstants.CredentialsPrefix,
				AuthServiceConstants.GooglePrefix,
			];

			builder
				.SetNotEmptyRule().WithMessage("Prefix is required.")
				.SetOneOfRule(prefixes)
				.WithMessage($"Prefix must be one of the following: {string.Join(", ", prefixes)}");
			return builder.Build()!;
		}
	}
}