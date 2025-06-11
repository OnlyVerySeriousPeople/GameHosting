using AuthService.Dotnet.Application.Common.Models;
using AuthService.Dotnet.Application.Validation.Validators;
using AuthService.Dotnet.Application.Validation;
using AuthService.Dotnet.Application.Validation.Builder;
using AuthService.Dotnet.Domain.Entities;
using AuthService.Dotnet.Domain.Exceptions;
using MediatR;

namespace AuthService.Dotnet.Application.UseCases.RefreshToken
{
	public class RefreshTokenValidator : BaseValidator<RefreshTokenCommand>
	{
		public override Result<Unit> Validate(RefreshTokenCommand command)
		{
			try
			{
				var builder = new ValidationChainBuilder<string>();
				var prefixValidationBuilder = new PrefixValidationBuilder();
				var prefixValidationChain = prefixValidationBuilder.Build(builder);
				var prefixValidationResult = prefixValidationChain.Handle(command.Prefix);

				if (prefixValidationResult.IsSuccess)
					return Result<Unit>.Success(Unit.Value);

				return Result<Unit>.Failure(ValidationsErrors.ValidationFailed(prefixValidationResult.Error));
			}
			catch (Exception ex)
			{
				return Result<Unit>.Failure(ValidationsErrors.IncorrectValidationHandlerUsage(ex.Message));
			}
		}
	}
}
