using AuthService.Dotnet.Application.Common.Models;
using AuthService.Dotnet.Application.Validation;
using AuthService.Dotnet.Application.Validation.Builder;
using AuthService.Dotnet.Application.Validation.Validators;
using AuthService.Dotnet.Domain.Entities;
using AuthService.Dotnet.Domain.Exceptions;
using MediatR;

namespace AuthService.Dotnet.Application.UseCases.Login
{
	public class LoginValidator : BaseValidator<LoginCommand>
	{
		public override Result<Unit> Validate(LoginCommand command)
		{
			try
			{
				var builder = new ValidationChainBuilder<string>();
				var providerValidationBuilder = new ProviderValidationBuilder();
				var providerValidationChain = providerValidationBuilder.Build(builder);
				var providerValidationResult = providerValidationChain.Handle(command.Provider);

				if (!string.IsNullOrEmpty(command.Code))
				{
					var codeValidationBuilder = new CodeValidationBuilder();
					var codeValidationChain = codeValidationBuilder.Build(builder);
					var codeValidationResult = codeValidationChain.Handle(command.Code!);

					return BuildResult(providerValidationResult, codeValidationResult);
				}

				var emailValidationBuilder = new EmailValidationBuilder();
				var emailValidationChain = emailValidationBuilder.Build(builder);
				var emailValidationResult = emailValidationChain.Handle(command.Email!);

				return BuildResult(providerValidationResult, emailValidationResult);
			}
			catch (Exception ex)
			{
				return Result<Unit>.Failure(ValidationsErrors.IncorrectValidationHandlerUsage(ex.Message));
			}
		}
	}
}