using AuthService.Dotnet.Application.Contracts;
using AuthService.Dotnet.Application.Validation.Builder;
using AuthService.Dotnet.Domain.Constants;

namespace AuthService.Dotnet.Application.Validation.Validators
{
	public class ProviderValidationBuilder : IValidationBuilder<string>
	{
		public IValidationHandler<string> Build(ValidationChainBuilder<string> builder)
		{
			List<string> providers =
			[
				AuthServiceConstants.GoogleProviderName,
				AuthServiceConstants.CredentialsProviderName
			];

			builder
				.SetNotEmptyRule().WithMessage("Provider is required.")
				.SetOneOfRule(providers)
				.WithMessage($"Provider must be one of the following: {string.Join(", ", providers)}");
			return builder.Build()!;
		}
	}
}