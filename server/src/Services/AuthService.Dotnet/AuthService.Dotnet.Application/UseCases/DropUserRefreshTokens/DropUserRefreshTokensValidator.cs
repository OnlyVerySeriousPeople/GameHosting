using AuthService.Dotnet.Application.Common.Models;
using AuthService.Dotnet.Application.Validation.Validators;
using AuthService.Dotnet.Application.Validation;
using AuthService.Dotnet.Application.Validation.Builder;
using AuthService.Dotnet.Domain.Entities;
using AuthService.Dotnet.Domain.Exceptions;
using MediatR;

namespace AuthService.Dotnet.Application.UseCases.DropUserRefreshTokens
{
	public class DropUserRefreshTokensValidator : BaseValidator<DropUserRefreshTokensCommand>
	{
		public override Result<Unit> Validate(DropUserRefreshTokensCommand command)
		{
			try
			{
				var builder = new ValidationChainBuilder<string>();
				var userIdValidationBuilder = new UserIdValidationBuilder();
				var userIdValidationChain = userIdValidationBuilder.Build(builder);
				var userIdValidationResult = userIdValidationChain.Handle(command.UserId);

				if (userIdValidationResult.IsSuccess)
					return Result<Unit>.Success(Unit.Value);

				return Result<Unit>.Failure(ValidationsErrors.ValidationFailed(userIdValidationResult.Error));
			}
			catch (Exception ex)
			{
				return Result<Unit>.Failure(ValidationsErrors.IncorrectValidationHandlerUsage(ex.Message));
			}
		}
	}
}