using AuthService.Dotnet.Application.Common.Models;
using AuthService.Dotnet.Application.Validation.Validators;
using AuthService.Dotnet.Application.Validation;
using AuthService.Dotnet.Application.Validation.Builder;
using AuthService.Dotnet.Domain.Entities;
using AuthService.Dotnet.Domain.Exceptions;
using MediatR;

namespace AuthService.Dotnet.Application.UseCases.Register
{
	public class RegisterValidator : BaseValidator<RegisterCommand>
	{
		public override Result<Unit> Validate(RegisterCommand command)
		{
			try
			{
				var builder = new ValidationChainBuilder<string>();
				var usernameValidationBuilder = new UsernameValidationBuilder();
				var emailValidationBuilder = new EmailValidationBuilder();
				var playerIdValidationBuilder = new UserIdValidationBuilder();

				var usernameValidationChain = usernameValidationBuilder.Build(builder);
				var emailValidationChain = emailValidationBuilder.Build(builder);
				var playerIdValidationChain = playerIdValidationBuilder.Build(builder);


				var usernameValidationResult = usernameValidationChain.Handle(command.Username);
				var emailValidationResult = emailValidationChain.Handle(command.Email);
				var playerIdValidationResult = playerIdValidationChain.Handle(command.PlayerId);

				return BuildResult(usernameValidationResult, emailValidationResult, playerIdValidationResult);
			}
			catch (Exception ex)
			{
				return Result<Unit>.Failure(ValidationsErrors.IncorrectValidationHandlerUsage(ex.Message));
			}
		}
	}
}